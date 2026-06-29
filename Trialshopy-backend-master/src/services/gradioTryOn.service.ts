import axios, { AxiosError } from "axios";
import { v2 as cloudinary } from "cloudinary";
import { randomUUID } from "crypto";
import { Readable } from "stream";



/**
 * Result returned by the Gradio Try-On service.
 */
export interface GradioTryOnResult {
  resultUrl: string;
}

/**
 * Progress/status update emitted while polling the queue.
 */
export interface GradioQueueStatus {
  msg: string;
  rank?: number;
  rankEta?: number;
}

/**
 * Reusable service that drives the Gradio Queue API workflow:
 *  1. Upload person image to Cloudinary (if it is a base64 blob)
 *  2. POST /trial/api/join_queue/
 *  3. Poll POST /trial/api/queue_data/ every POLL_INTERVAL_MS ms
 *  4. Return the result image URL once processing is complete
 */
export class GradioTryOnService {
  // CatVTON on HF Spaces can take up to 5 min in a queue
  private static readonly POLL_INTERVAL_MS = 5000;   // 5 s between polls
  private static readonly MAX_POLL_ATTEMPTS = 72;    // 72 x 5 s = 6 min max

  /**
   * Generates a virtual try-on image.
   *
   * @param personImageBase64 - Base64-encoded person image (data URI) or a public URL
   * @param garmentImageUrl   - Public URL of the garment image
   * @param onStatus          - Optional callback invoked on each status update from the queue
   * @returns GradioTryOnResult containing the result image URL
   */
  public static async generate(
    personImageBase64: string,
    garmentImageUrl: string,
    onStatus?: (status: GradioQueueStatus) => void
  ): Promise<GradioTryOnResult> {
    const baseUrl = (process.env.VIRTUAL_TRYON_API || "http://127.0.0.1:8000").replace(/\/$/, "");

    // ── Step 0: Health-check — make sure the bridge server is reachable ───────
    try {
      await axios.get(`${baseUrl}/health`, { timeout: 5_000 });
    } catch {
      throw new Error(
        "The Virtual Try-On bridge server is not running. " +
        "Please start it by double-clicking start_tryon.bat and try again."
      );
    }

    // ── Step 1: Upload person image to Cloudinary if needed ──────────────────
    // Configure cloudinary here (runtime) so env vars are guaranteed to be loaded
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    let personPublicUrl = personImageBase64;
    if (personImageBase64.startsWith("data:image")) {
      console.info("[GradioTryOn] Uploading person image to Cloudinary…");
      personPublicUrl = await GradioTryOnService.uploadPersonImage(personImageBase64);
    }


    // ── Step 2: Join the Gradio queue ─────────────────────────────────────────
    const sessionHash = randomUUID().replace(/-/g, "").substring(0, 11);
    const triggerId = Math.floor(Math.random() * 10_000);

    const joinPayload = {
      data: [
        personPublicUrl,   // person image URL
        garmentImageUrl,   // garment image URL
        true,              // enable auto-masking
        true,              // enable auto-resize
      ],
      event_data: null,
      fn_index: 0,
      trigger_id: triggerId,
      session_hash: sessionHash,
    };

    console.info("[GradioTryOn] Joining queue. session_hash=%s trigger_id=%d", sessionHash, triggerId);

    let eventId: string;
    try {
      const joinRes = await axios.post(
        `${baseUrl}/trial/api/join_queue/`,
        joinPayload,
        {
          headers: { "Content-Type": "application/json" },
          timeout: 15_000,
        }
      );

      eventId = joinRes.data?.event_id;
      if (!eventId) {
        console.error("[GradioTryOn] join_queue response missing event_id:", joinRes.data);
        throw new Error("No event_id received from the try-on server.");
      }
      console.info("[GradioTryOn] Joined queue. event_id=%s", eventId);
    } catch (err: any) {
      const detail = (err as AxiosError)?.response?.data ?? err.message;
      console.error("[GradioTryOn] join_queue error:", detail);
      throw new Error("Could not connect to the Virtual Try-On service. Please try again later.");
    }

    // ── Step 3: Poll queue_data until processing completes ────────────────────
    const pollPayload = {
      event_id: eventId,
      session_hash: sessionHash,
    };

    console.info("[GradioTryOn] Starting polling for event_id=%s", eventId);

    for (let attempt = 1; attempt <= GradioTryOnService.MAX_POLL_ATTEMPTS; attempt++) {
      await GradioTryOnService.delay(GradioTryOnService.POLL_INTERVAL_MS);

      let pollData: any;
      try {
        const pollRes = await axios.post(
          `${baseUrl}/trial/api/queue_data/`,
          pollPayload,
          {
            headers: { "Content-Type": "application/json" },
            timeout: 10_000,
          }
        );
        pollData = pollRes.data;
      } catch (err: any) {
        const detail = (err as AxiosError)?.response?.data ?? err.message;
        console.warn(`[GradioTryOn] Poll attempt ${attempt} failed:`, detail);
        // Non-fatal — keep retrying unless we've hit max attempts
        continue;
      }

      const msg: string = pollData?.msg ?? "";
      console.info("[GradioTryOn] Poll attempt %d/%d — msg=%s", attempt, GradioTryOnService.MAX_POLL_ATTEMPTS, msg);

      // Emit status update to caller
      if (onStatus) {
        onStatus({
          msg,
          rank: pollData?.rank,
          rankEta: pollData?.rank_eta,
        });
      }

      switch (msg) {
        case "queue_full":
          throw new Error("The try-on server is currently busy. Please try again in a moment.");

        case "estimation":
        case "queue":
          // Still queued — keep waiting
          console.info("[GradioTryOn] Position in queue: %s, ETA: %s s", pollData?.rank, pollData?.rank_eta);
          continue;

        case "process_starts":
        case "process_generating":
          // Processing in progress — keep polling
          continue;

        case "process_completed": {
          // ── Step 4: Extract result URL ────────────────────────────────────
          const outputData = pollData?.output?.data ?? pollData?.data;

          // The model typically returns an array; the image is the first element
          // It can be { url: "..." }, a plain string URL, or nested structures
          const resultUrl = GradioTryOnService.extractResultUrl(outputData);

          if (resultUrl) {
            console.info("[GradioTryOn] Processing complete. resultUrl=%s", resultUrl);
            return { resultUrl };
          }

          // process_completed but no usable URL — treat as error
          console.error("[GradioTryOn] process_completed but no result URL found:", JSON.stringify(outputData));
          throw new Error("Virtual Try-On completed but no output image was returned.");
        }

        case "process_errored": {
          const serverErr = pollData?.error || "";
          console.error("[GradioTryOn] Server reported process_errored:", JSON.stringify(pollData));
          throw new Error(
            serverErr
              ? `Virtual Try-On failed: ${serverErr}`
              : "The Virtual Try-On model encountered an error. Please try again."
          );
        }

        default:
          // Unknown message — keep polling
          continue;
      }
    }

    throw new Error("Virtual Try-On timed out. The server may be overloaded — please try again.");
  }

  /**
   * Extracts the first usable image URL from the Gradio output data array.
   */
  private static extractResultUrl(outputData: any): string | null {
    if (!outputData) return null;

    // data is an array — iterate
    const arr: any[] = Array.isArray(outputData) ? outputData : [outputData];

    for (const item of arr) {
      if (!item) continue;

      // Plain string URL
      if (typeof item === "string" && (item.startsWith("http") || item.startsWith("/"))) {
        return item;
      }

      // { url: "..." } object
      if (typeof item === "object" && item.url && typeof item.url === "string") {
        return item.url;
      }

      // Nested: { path: "...", url: "..." }
      if (typeof item === "object" && item.path && typeof item.path === "string") {
        return item.path;
      }
    }

    return null;
  }

  /**
   * Uploads a base64 person image to Cloudinary using a stream-based approach
   * with up to 3 retry attempts to handle transient ECONNRESET errors.
   */
  public static async uploadPersonImage(base64DataUri: string): Promise<string> {
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const MAX_RETRIES = 3;
    const RETRY_DELAY_MS = 2000;

    // Strip the data URI prefix to get raw base64
    const base64Data = base64DataUri.replace(/^data:image\/\w+;base64,/, "");
    const imageBuffer = Buffer.from(base64Data, "base64");

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        console.info(`[GradioTryOn] Cloudinary upload attempt ${attempt}/${MAX_RETRIES}…`);

        const uploadResult = await new Promise<any>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: "virtual_tryon/persons",
              resource_type: "image",
              public_id: `person_${Date.now()}`,
              timeout: 120000, // 2-minute timeout
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );

          const readable = new Readable();
          readable.push(imageBuffer);
          readable.push(null);
          readable.pipe(uploadStream);
        });

        const url = uploadResult?.secure_url;
        if (!url) throw new Error("No secure_url in Cloudinary response");

        console.info("[GradioTryOn] Person image uploaded successfully:", url);
        return url;

      } catch (err: any) {
        const errCode = err?.http_code || err?.code || "UNKNOWN";
        console.error(
          `[GradioTryOn] Cloudinary upload attempt ${attempt} failed (${errCode}):`,
          err?.message || JSON.stringify(err)
        );

        if (attempt < MAX_RETRIES) {
          console.info(`[GradioTryOn] Retrying in ${RETRY_DELAY_MS / 1000}s…`);
          await GradioTryOnService.delay(RETRY_DELAY_MS);
        } else {
          throw new Error(
            "Failed to upload person image after multiple attempts. " +
            "Please check your internet connection and try again."
          );
        }
      }
    }

    // TypeScript satisfaction — unreachable
    throw new Error("Upload failed.");
  }

  private static delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
