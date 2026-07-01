"use client";
import React, { useState, useRef, useContext, useEffect } from "react";
import axios from "axios";
import { VirtualContext } from "@/lib/TryOnContext";

// ── Queue status message → human-readable label ───────────────────────────────
const STATUS_LABELS = {
  uploading: "Uploading your photo…",
  retry_upload_1: "Upload failed, retrying… (attempt 2/3)",
  retry_upload_2: "Upload failed, retrying… (attempt 3/3)",
  estimation: "Waiting in queue…",
  queue: "Waiting in queue…",
  process_starts: "AI model is starting…",
  process_generating: "Generating your look…",
  process_completed: "Done!",
  queue_full: "Queue is full, please try again shortly.",
  process_errored: "An error occurred on the server.",
};

const Page = () => {
  const [imageData, setImageData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [useCamera, setUseCamera] = useState(true);
  const [cameraActive, setCameraActive] = useState(false);
  const [error, setError] = useState(null);
  const [queueStatus, setQueueStatus] = useState(null); // { msg, rank, rankEta }
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const { tryOn, updateTryOnUrls } = useContext(VirtualContext);

  useEffect(() => {
    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      setCameraActive(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Could not access camera. Please check permissions and try again.");
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const captureImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");

    // Flip the canvas horizontally so it doesn't save as a backwards mirror-selfie
    context.translate(canvas.width, 0);
    context.scale(-1, 1);

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const capturedImage = canvas.toDataURL("image/jpeg");
    setImageData(capturedImage);
    stopCamera();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match("image.*")) {
      setError("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setImageData(event.target.result);
      setError(null);
    };
    reader.onerror = () => {
      setError("Failed to read the file");
    };
    reader.readAsDataURL(file);
  };

  /**
   * Step 1: Upload person image to Cloudinary via the dedicated endpoint.
   * Step 2: Call the Gradio try-on endpoint with just the URL.
   * This avoids sending a huge base64 payload through the AI pipeline (ECONNRESET fix).
   */
  const uploadPersonImage = async () => {
    if (!imageData) {
      setError("Please capture or upload a photo first");
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);
      setQueueStatus(null);
      updateTryOnUrls({ imageUrl: "" }); // clear any previous result

      if (!tryOn.clothUrl) {
        throw new Error("No clothing image selected. Please go back and select a product first.");
      }

      const backendApiUrl = process.env.NEXT_PUBLIC_BASE_API_URL;

      // ── Step 1: Upload person image to Cloudinary ────────────────────────
      let personImageUrl = imageData;
      if (imageData.startsWith("data:image")) {
        setQueueStatus({ msg: "uploading", rank: null, rankEta: null });

        let uploadAttempt = 0;
        const MAX_UPLOAD_RETRIES = 3;
        let uploadError = null;

        while (uploadAttempt < MAX_UPLOAD_RETRIES) {
          uploadAttempt++;
          try {
            const uploadRes = await axios.post(
              `${backendApiUrl}/api/v1/tryon/upload-person`,
              { personImage: imageData },
              { timeout: 120_000 } // 2 min for the upload step
            );
            if (uploadRes.data.success && uploadRes.data.url) {
              personImageUrl = uploadRes.data.url;
              uploadError = null;
              break;
            }
            throw new Error(uploadRes.data.message || "Upload failed");
          } catch (err) {
            uploadError = err;
            if (uploadAttempt < MAX_UPLOAD_RETRIES) {
              setQueueStatus({ msg: `retry_upload_${uploadAttempt}`, rank: null, rankEta: null });
              await new Promise((r) => setTimeout(r, 2000)); // wait 2s before retry
            }
          }
        }

        if (uploadError) {
          throw new Error(
            uploadError?.response?.data?.message ||
              uploadError?.message ||
              "Failed to upload your photo. Please check your connection and try again."
          );
        }
      }

      // ── Step 2: Call Gradio Try-On with the Cloudinary URL ───────────────
      setQueueStatus({ msg: "queue", rank: null, rankEta: null });

      const response = await axios.post(
        `${backendApiUrl}/api/v1/tryon/gradio`,
        {
          personImage: personImageUrl, // now a URL, not base64
          garmentImage: tryOn.clothUrl,
        },
        {
          timeout: 420_000, // 7 min — backend polls up to ~6 min on HF Space
          onUploadProgress: () => {
            setQueueStatus({ msg: "process_starts", rank: null, rankEta: null });
          },
        }
      );

      if (response.data.success && response.data.resultUrl) {
        setQueueStatus({ msg: "process_completed" });
        updateTryOnUrls({ imageUrl: response.data.resultUrl });
      } else {
        throw new Error(response.data.message || "Failed to generate Virtual Try-On.");
      }
    } catch (err) {
      console.error("Error processing the image:", err);
      const msg =
        err?.response?.data?.message ||
        err.message ||
        "Virtual Try-On is unavailable right now. Please try again.";
      setError(msg);
      setQueueStatus(null);
    } finally {
      setIsProcessing(false);
    }
  };

  // ── Queue status helper ─────────────────────────────────────────────────────
  const getStatusLabel = () => {
    if (!queueStatus) return "Processing…";
    const { msg, rank, rankEta } = queueStatus;
    const base = STATUS_LABELS[msg] || "Processing…";
    if ((msg === "estimation" || msg === "queue") && rank != null) {
      return `${base} (Position: ${rank}${rankEta != null ? `, ~${Math.ceil(rankEta)}s` : ""})`;
    }
    return base;
  };

  const resetPhoto = () => {
    setImageData(null);
    setError(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* ── Heading ──────────────────────────────────────────────── */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          Virtual <span className="text-[#EB8105]">Try-On</span>
        </h2>
        <p className="text-gray-500 mt-1 text-sm md:text-base">
          See how this outfit looks on you in a few seconds.
        </p>
      </div>

      {/* ── Two-column: your photo (step 1) + garment (step 2) ───── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Step 1 — Your Photo */}
        <div className="bg-white border border-gray-200 rounded-md shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-[#EB8105] text-white text-xs font-semibold px-2 py-1 rounded">
              Step 1
            </span>
            <h3 className="text-lg font-semibold text-gray-800">Your Photo</h3>
          </div>

          {/* If a photo is captured/uploaded, preview it */}
          {imageData ? (
            <div className="flex flex-col items-center">
              <img
                src={imageData}
                alt="Selected"
                className="w-full h-72 object-cover rounded-md border border-gray-200"
              />
              <button
                onClick={resetPhoto}
                className="mt-3 text-sm font-medium text-[#EB8105] hover:underline"
              >
                Retake / Choose another
              </button>
            </div>
          ) : (
            <>
              {/* Camera / Upload switch */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setUseCamera(true)}
                  className={`flex-1 py-2 text-sm font-semibold rounded-md border transition-colors ${
                    useCamera
                      ? "bg-[#EB8105] text-white border-[#EB8105]"
                      : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  Use Camera
                </button>
                <button
                  onClick={() => {
                    setUseCamera(false);
                    if (cameraActive) stopCamera();
                  }}
                  className={`flex-1 py-2 text-sm font-semibold rounded-md border transition-colors ${
                    !useCamera
                      ? "bg-[#EB8105] text-white border-[#EB8105]"
                      : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  Upload Photo
                </button>
              </div>

              {/* Camera view */}
              {useCamera && (
                <div>
                  <div className="relative bg-black rounded-md overflow-hidden h-72">
                    <video
                      ref={videoRef}
                      className="w-full h-full object-cover"
                      style={{ transform: "scaleX(-1)" }}
                      playsInline
                      muted
                    />
                    {!cameraActive && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/70 text-center px-4">
                        <p className="text-white mb-3 text-sm">Camera is off</p>
                        <button
                          onClick={startCamera}
                          className="px-5 py-2 bg-[#EB8105] text-white font-semibold rounded-md hover:bg-[#FAAC06] transition-colors"
                        >
                          Start Camera
                        </button>
                      </div>
                    )}
                  </div>

                  {cameraActive && (
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={captureImage}
                        className="flex-1 py-2 bg-[#EB8105] text-white font-semibold rounded-md hover:bg-[#FAAC06] transition-colors"
                      >
                        Capture
                      </button>
                      <button
                        onClick={stopCamera}
                        className="flex-1 py-2 bg-gray-700 text-white font-semibold rounded-md hover:bg-gray-800 transition-colors"
                      >
                        Stop
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Upload view */}
              {!useCamera && (
                <label className="flex flex-col items-center justify-center w-full h-72 border-2 border-dashed border-[#EB8105] rounded-md cursor-pointer bg-orange-50 hover:bg-orange-100 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-[#EB8105] mb-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="text-gray-700 text-sm">
                    <span className="font-semibold text-[#EB8105]">Click to upload</span> your photo
                  </p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG or JPEG (Max. 5MB)</p>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              )}
            </>
          )}
        </div>

        {/* Step 2 — Garment */}
        <div className="bg-white border border-gray-200 rounded-md shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-[#EB8105] text-white text-xs font-semibold px-2 py-1 rounded">
              Step 2
            </span>
            <h3 className="text-lg font-semibold text-gray-800">Garment</h3>
          </div>

          {tryOn.clothUrl ? (
            <div className="flex items-center justify-center h-72 bg-gray-50 rounded-md border border-gray-200">
              <img
                src={tryOn.clothUrl}
                alt="Garment"
                className="max-h-full max-w-full object-contain"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-72 bg-gray-50 rounded-md border-2 border-dashed border-gray-200 text-center px-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-gray-300 mb-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <p className="text-gray-500 text-sm font-medium">No clothing selected</p>
              <p className="text-gray-400 text-xs mt-1">
                Open a product and tap “Virtual Try On”.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Try It On button ─────────────────────────────────────── */}
      <button
        onClick={uploadPersonImage}
        disabled={isProcessing || !imageData || !tryOn.clothUrl}
        className={`mt-6 w-full py-3 rounded-md font-semibold text-white flex items-center justify-center gap-2 transition-colors ${
          isProcessing || !imageData || !tryOn.clothUrl
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-gradient-to-b from-[#FAAC06] to-[#EB8105] hover:opacity-95"
        }`}
      >
        {isProcessing ? (
          <>
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            {getStatusLabel()}
          </>
        ) : (
          "Try It On"
        )}
      </button>

      {/* Processing note */}
      {isProcessing && (
        <p className="text-center text-xs text-gray-500 mt-3">
          Our AI is working on your look — this can take 2–5 minutes on busy servers. Please
          don&apos;t close this tab.
        </p>
      )}

      {/* ── Error ────────────────────────────────────────────────── */}
      {error && (
        <div className="mt-5 p-4 bg-red-50 border border-red-200 rounded-md flex items-center gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-red-600 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <p className="text-red-700 text-sm font-medium">{error}</p>
        </div>
      )}

      {/* ── Result ───────────────────────────────────────────────── */}
      {tryOn.imageUrl && (
        <div className="mt-8 bg-white border border-gray-200 rounded-md shadow-sm p-6">
          <h3 className="text-lg md:text-xl font-semibold text-center text-gray-800 mb-5">
            Here&apos;s <span className="text-[#EB8105]">Your Look</span>
          </h3>
          <div className="flex flex-col items-center">
            <img
              src={tryOn.imageUrl}
              alt="Virtual Try-On Result"
              className="max-w-full max-h-[600px] object-contain rounded-md border border-gray-200"
            />
            <a
              href={tryOn.imageUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 px-6 py-2.5 bg-[#EB8105] text-white rounded-md font-semibold hover:bg-[#FAAC06] transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Download
            </a>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default Page;
