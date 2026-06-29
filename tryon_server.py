# -*- coding: utf-8 -*-
"""
TrialShopy Virtual Try-On Bridge Server
========================================
A lightweight Flask microservice that bridges TrialShopy's Node.js backend
with the CatVTON Hugging Face Space via gradio_client.

Architecture:
  Node.js backend --> POST /trial/api/join_queue/  --> this server
                      POST /trial/api/queue_data/  --> this server
                  <-- { resultUrl }

The server accepts image URLs (person + garment), calls the CatVTON HF Space
synchronously via gradio_client, and returns the result as a download URL.

Usage:
  python tryon_server.py

Dependencies:
  pip install flask gradio_client pillow requests

Environment variables (optional):
  TRYON_PORT=8000                   Port to listen on (default: 8000)
  HF_TOKEN=hf_xxx...                Hugging Face token (for private spaces)
  CATVTON_SPACE=zhengchong/CatVTON  HF Space ID
  CLOTH_TYPE=upper                  upper | lower | overall (default: upper)
"""

import os
import uuid
import threading
import tempfile
import shutil
import logging
import traceback
from datetime import datetime

import requests
from flask import Flask, request, jsonify, send_file
from gradio_client import Client, handle_file

# ============================================================
# Logging
# ============================================================
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
log = logging.getLogger("tryon_server")

# ============================================================
# Config
# ============================================================
PORT       = int(os.environ.get("TRYON_PORT", 8000))
HF_TOKEN   = os.environ.get("HF_TOKEN", None)            # optional
SPACE_ID   = os.environ.get("CATVTON_SPACE", "zhengchong/CatVTON")
CLOTH_TYPE = os.environ.get("CLOTH_TYPE", "upper")       # upper | lower | overall
RESULT_TTL = 300  # seconds - how long result files are kept (5 min)

# ============================================================
# In-memory job store
# job_id -> { status, result_url, error, created_at }
# ============================================================
jobs = {}
jobs_lock = threading.Lock()

# ============================================================
# Temp file directory
# ============================================================
TEMP_DIR = os.path.join(tempfile.gettempdir(), "tryon_results")
os.makedirs(TEMP_DIR, exist_ok=True)

app = Flask(__name__)


# ============================================================
# Helpers
# ============================================================

def download_image_to_temp(url):
    """Download a remote image URL to a temp file; return the local path."""
    ext = ".jpg"
    filename = url.split("?")[0].split("/")[-1]
    if "." in filename:
        candidate = "." + filename.rsplit(".", 1)[-1].lower()
        if candidate in (".jpg", ".jpeg", ".png", ".webp"):
            ext = candidate

    tmp_path = os.path.join(TEMP_DIR, "input_" + uuid.uuid4().hex + ext)
    resp = requests.get(url, timeout=30, stream=True)
    resp.raise_for_status()
    with open(tmp_path, "wb") as f:
        for chunk in resp.iter_content(8192):
            f.write(chunk)
    log.info("Downloaded %s -> %s", url[:80], tmp_path)
    return tmp_path


def cleanup_temp_file(path):
    """Delete a temp file silently."""
    try:
        if path and os.path.exists(path):
            os.remove(path)
    except Exception:
        pass


def process_tryon(job_id, person_url, garment_url):
    """
    Background thread: call CatVTON HF Space and store the result.
    """
    person_path = None
    garment_path = None
    result_copy_path = None

    try:
        log.info("[%s] Starting CatVTON inference...", job_id)
        log.info("[%s] Person URL : %s", job_id, person_url[:80])
        log.info("[%s] Garment URL: %s", job_id, garment_url[:80])

        # Mark as running so the poller shows "AI model is starting..."
        with jobs_lock:
            if job_id in jobs:
                jobs[job_id]["status"] = "running"

        # Download input images
        person_path  = download_image_to_temp(person_url)
        garment_path = download_image_to_temp(garment_url)

        # Connect to CatVTON HF Space
        # Use a long httpx timeout so the connection itself doesn't drop
        log.info("[%s] Connecting to HF Space: %s", job_id, SPACE_ID)
        client_kwargs = {
            "src": SPACE_ID,
            "httpx_kwargs": {"timeout": 120},  # 2-min HTTP timeout per request
        }
        if HF_TOKEN:
            client_kwargs["hf_token"] = HF_TOKEN

        client = Client(**client_kwargs)

        # Call the submit_function via submit() + job.result() so we can set
        # a long timeout independently of the HTTP layer.
        # Retry up to 2 times to handle cold-start Space wake-ups.
        MAX_RETRIES = 2
        result = None
        last_error = None

        for attempt in range(1, MAX_RETRIES + 1):
            try:
                log.info("[%s] Submitting to CatVTON (attempt %d/%d)...", job_id, attempt, MAX_RETRIES)
                job = client.submit(
                    person_image={
                        "background": handle_file(person_path),
                        "layers": [],      # no manual mask -> triggers AutoMasker
                        "composite": None,
                    },
                    cloth_image=handle_file(garment_path),
                    cloth_type=CLOTH_TYPE,
                    num_inference_steps=50,
                    guidance_scale=2.5,
                    seed=42,
                    show_type="result only",
                    api_name="/submit_function",
                )
                # Wait up to 6 minutes for the job to complete
                result = job.result(timeout=360)
                log.info("[%s] Job completed on attempt %d", job_id, attempt)
                break  # success
            except Exception as e:
                last_error = e
                log.warning("[%s] Attempt %d failed: %s", job_id, attempt, e)
                if attempt < MAX_RETRIES:
                    log.info("[%s] Retrying in 10s (HF Space may be waking up)...", job_id)
                    import time as _time
                    _time.sleep(10)
                    # Re-connect on retry
                    client = Client(**client_kwargs)

        if result is None:
            raise RuntimeError(
                "CatVTON inference failed after {} attempts. Last error: {}".format(
                    MAX_RETRIES, last_error
                )
            )

        log.info("[%s] Raw result from CatVTON: %s", job_id, str(result)[:200])

        # Result is typically a file path (string) or a dict with 'url' / 'path'
        result_path = None
        if isinstance(result, str) and os.path.exists(result):
            result_path = result
        elif isinstance(result, dict):
            result_path = result.get("path") or result.get("url")
        elif isinstance(result, (list, tuple)) and len(result) > 0:
            first = result[0]
            if isinstance(first, str) and os.path.exists(first):
                result_path = first
            elif isinstance(first, dict):
                result_path = first.get("path") or first.get("url")

        if not result_path:
            raise ValueError("No output image found in result: " + str(result))

        # Copy result to our managed temp dir so we can serve it
        result_copy_path = os.path.join(TEMP_DIR, "result_" + job_id + ".jpg")
        if isinstance(result_path, str) and result_path.startswith("http"):
            # It is a URL - download it
            resp = requests.get(result_path, timeout=30, stream=True)
            resp.raise_for_status()
            with open(result_copy_path, "wb") as f:
                for chunk in resp.iter_content(8192):
                    f.write(chunk)
        else:
            shutil.copy2(result_path, result_copy_path)

        # Store success
        with jobs_lock:
            jobs[job_id] = {
                "status": "completed",
                "result_file": result_copy_path,
                "result_url": "http://127.0.0.1:{}/trial/result/{}".format(PORT, job_id),
                "created_at": datetime.utcnow(),
            }
        log.info("[%s] Done. Result stored at %s", job_id, result_copy_path)

    except Exception as exc:
        log.error("[%s] Error: %s", job_id, exc)
        log.debug(traceback.format_exc())
        with jobs_lock:
            jobs[job_id] = {
                "status": "failed",
                "error": str(exc),
                "created_at": datetime.utcnow(),
            }
    finally:
        cleanup_temp_file(person_path)
        cleanup_temp_file(garment_path)
        # Schedule result file cleanup after TTL
        if result_copy_path:
            timer = threading.Timer(RESULT_TTL, cleanup_temp_file, args=[result_copy_path])
            timer.daemon = True
            timer.start()


# ============================================================
# Routes - matching what Node.js gradioTryOn.service.ts expects
# ============================================================

@app.route("/trial/api/join_queue/", methods=["POST"])
def join_queue():
    """
    Accept a try-on request, spawn a background worker, return event_id.

    Expected JSON body:
    {
        "data": [ <person_url>, <garment_url>, ... ],
        "session_hash": "...",
        "fn_index": 0,
        "trigger_id": 123
    }
    """
    body = request.get_json(force=True, silent=True) or {}

    data = body.get("data", [])
    if len(data) < 2:
        return jsonify({"error": "data must have [person_url, garment_url]"}), 400

    person_url  = data[0]
    garment_url = data[1]

    if not person_url or not garment_url:
        return jsonify({"error": "person_url and garment_url are required"}), 400

    job_id = uuid.uuid4().hex

    with jobs_lock:
        jobs[job_id] = {
            "status": "queued",
            "created_at": datetime.utcnow(),
        }

    # Spawn background thread
    t = threading.Thread(
        target=process_tryon,
        args=(job_id, person_url, garment_url),
        daemon=True,
        name="tryon-" + job_id[:8],
    )
    t.start()

    log.info("Job %s queued. person=%s garment=%s", job_id, person_url[:60], garment_url[:60])
    return jsonify({"event_id": job_id}), 200


@app.route("/trial/api/queue_data/", methods=["POST"])
def queue_data():
    """
    Poll for job status.

    Expected JSON body:
    { "event_id": "...", "session_hash": "..." }

    Returns Gradio-compatible status messages:
      { "msg": "estimation", "rank": N, "rank_eta": S }
      { "msg": "process_generating" }
      { "msg": "process_completed", "output": { "data": [<result_url>] } }
      { "msg": "process_errored", "error": "..." }
    """
    body = request.get_json(force=True, silent=True) or {}
    job_id = body.get("event_id", "")

    with jobs_lock:
        job = jobs.get(job_id)

    if not job:
        return jsonify({"msg": "process_errored", "error": "Unknown event_id"}), 404

    status = job["status"]

    if status == "queued":
        return jsonify({"msg": "estimation", "rank": 1, "rank_eta": 30}), 200

    elif status == "running":
        return jsonify({"msg": "process_generating"}), 200

    elif status == "completed":
        result_url = job.get("result_url", "")
        return jsonify({
            "msg": "process_completed",
            "output": {
                "data": [result_url]
            },
        }), 200

    elif status == "failed":
        return jsonify({
            "msg": "process_errored",
            "error": job.get("error", "Unknown error"),
        }), 200

    else:
        return jsonify({"msg": "estimation", "rank": 1, "rank_eta": 10}), 200


@app.route("/trial/result/<job_id>", methods=["GET"])
def serve_result(job_id):
    """Serve the generated result image file."""
    with jobs_lock:
        job = jobs.get(job_id)

    if not job or job.get("status") != "completed":
        return jsonify({"error": "Result not found or not ready"}), 404

    result_file = job.get("result_file", "")
    if not result_file or not os.path.exists(result_file):
        return jsonify({"error": "Result file missing"}), 404

    return send_file(result_file, mimetype="image/jpeg", as_attachment=False)


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "space": SPACE_ID, "cloth_type": CLOTH_TYPE}), 200


# ============================================================
# Entry point
# ============================================================
if __name__ == "__main__":
    log.info("=" * 60)
    log.info("TrialShopy Virtual Try-On Bridge Server")
    log.info("HF Space  : %s", SPACE_ID)
    log.info("Cloth type: %s", CLOTH_TYPE)
    log.info("Listening : http://127.0.0.1:%d", PORT)
    log.info("=" * 60)
    app.run(host="127.0.0.1", port=PORT, debug=False, threaded=True)
