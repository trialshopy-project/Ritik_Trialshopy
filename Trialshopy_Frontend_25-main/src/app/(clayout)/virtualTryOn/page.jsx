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
  const [isVideoData, setIsVideoData] = useState(false);
  const [mode, setMode] = useState("photo");
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
        stream.getTracks().forEach(track => track.stop());
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
          height: { ideal: 720 }
        } 
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
      stream.getTracks().forEach(track => track.stop());
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
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const capturedImage = canvas.toDataURL("image/jpeg");
    setImageData(capturedImage);
    setIsVideoData(false);
    stopCamera();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (mode === "photo" && !file.type.match("image.*")) {
      setError("Please select an image file");
      return;
    }
    
    if (mode === "video" && !file.type.match("video.*")) {
      setError("Please select a video file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setImageData(event.target.result);
      setIsVideoData(mode === "video");
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
      setError("Please capture or upload an image first");
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

      const backendApiUrl = process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:7000";

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
          personImage: personImageUrl,   // now a URL, not base64
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
    if (!queueStatus) return "Processing magic…";
    const { msg, rank, rankEta } = queueStatus;
    const base = STATUS_LABELS[msg] || "Processing…";
    if ((msg === "estimation" || msg === "queue") && rank != null) {
      return `${base} (Position: ${rank}${rankEta != null ? `, ~${Math.ceil(rankEta)}s` : ""})`;
    }
    return base;
  };

  return (
    <div className="max-w-6xl mx-auto p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl shadow-2xl border border-gray-200 mt-10">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#FAAC06] to-[#EB8105]">
          Virtual Try-On
        </h2>
        <p className="text-gray-500 mt-2">See how our clothing looks on you in seconds</p>
      </div>
      
      <div className="flex justify-center space-x-2 mb-10">
        <button
          onClick={() => {
            setMode("photo");
            setUseCamera(true);
            setImageData(null);
            setIsVideoData(false);
          }}
          className={`px-8 py-3 rounded-full font-bold transition-all duration-300 shadow-md ${mode === "photo" ? "bg-gradient-to-r from-[#FAAC06] to-[#EB8105] text-white scale-105" : "bg-white text-gray-600 hover:bg-gray-100"}`}
        >
          Photo Try-On
        </button>
        <button
          onClick={() => {
            setMode("video");
            setUseCamera(false);
            if (cameraActive) stopCamera();
            setImageData(null);
            setIsVideoData(false);
          }}
          className={`px-8 py-3 rounded-full font-bold transition-all duration-300 shadow-md ${mode === "video" ? "bg-gradient-to-r from-[#FAAC06] to-[#EB8105] text-white scale-105" : "bg-white text-gray-600 hover:bg-gray-100"}`}
        >
          Video Try-On
        </button>
      </div>

      {mode === "photo" && (
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => {
              setUseCamera(true);
              setImageData(null);
              setIsVideoData(false);
            }}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${useCamera 
            ? 'bg-gray-800 text-white shadow-lg' 
            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'}`}
        >
          Use Camera
        </button>
        <button
          onClick={() => {
            setUseCamera(false);
            if (cameraActive) stopCamera();
          }}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${!useCamera 
            ? 'bg-gray-800 text-white shadow-lg' 
            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'}`}
        >
          Upload Image
        </button>
      </div>
      )}

      {mode === "photo" && useCamera && (
        <div className="space-y-6 mb-10 max-w-3xl mx-auto">
          <div className="relative bg-black rounded-2xl overflow-hidden shadow-xl ring-4 ring-gray-100">
            <video 
              ref={videoRef} 
              className="w-full h-auto max-h-[500px] object-cover mx-auto"
              playsInline
              muted
            />
            {!cameraActive && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-60 backdrop-blur-sm">
                <div className="text-center p-8 bg-white rounded-2xl shadow-2xl transform transition-all hover:scale-105">
                  <p className="text-xl font-semibold text-gray-800 mb-6">Camera is not active</p>
                  <button 
                    onClick={startCamera}
                    className="px-8 py-3 bg-gradient-to-r from-[#FAAC06] to-[#EB8105] text-white font-bold rounded-full hover:shadow-lg transition-all"
                  >
                    Start Camera
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {cameraActive && (
            <div className="flex justify-center space-x-4 mt-6">
              <button 
                onClick={captureImage}
                className="px-8 py-3 bg-gradient-to-r from-[#FAAC06] to-[#EB8105] text-white font-bold rounded-full hover:shadow-lg transition-all flex items-center transform hover:-translate-y-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Capture Image
              </button>
              <button 
                onClick={stopCamera}
                className="px-8 py-3 bg-gray-800 text-white font-bold rounded-full hover:bg-gray-900 transition-all shadow-md flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                </svg>
                Stop Camera
              </button>
            </div>
          )}
        </div>
      )}

      {!useCamera && (
        <div className="mb-10 max-w-3xl mx-auto">
          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-[#FAAC06] rounded-2xl cursor-pointer bg-orange-50 hover:bg-orange-100 transition-colors shadow-sm group">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-[#EB8105] mb-4 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="mb-2 text-lg text-gray-700">
                <span className="font-bold text-[#EB8105]">Click to upload</span> or drag and drop
              </p>
              <p className="text-sm text-gray-500 font-medium">
                {mode === "photo" ? "PNG, JPG, JPEG (Max. 5MB)" : "Upload a short clip (max 10 sec) for best results (Max. 10MB)"}
              </p>
            </div>
            <input 
              type="file" 
              accept={mode === "photo" ? "image/*" : "video/mp4,video/x-m4v,video/*"} 
              onChange={handleFileUpload} 
              className="hidden" 
            />
          </label>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
        <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 flex flex-col">
          <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
            <h3 className="text-2xl font-bold text-gray-800">Your {mode === "photo" ? "Photo" : "Video"}</h3>
            <span className="bg-orange-100 text-[#EB8105] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Step 1</span>
          </div>
          {imageData ? (
            <div className="flex flex-col items-center flex-grow justify-center">
              {isVideoData ? (
                <video src={imageData} controls className="w-full max-h-80 object-cover rounded-2xl shadow-md ring-1 ring-gray-200" />
              ) : (
                <img 
                  src={imageData} 
                  alt="Selected" 
                  className="w-full max-h-80 object-cover rounded-2xl shadow-md ring-1 ring-gray-200"
                />
              )}
              <button
                onClick={uploadPersonImage}
                disabled={isProcessing}
                className={`mt-8 px-8 py-4 w-full rounded-2xl font-extrabold text-lg shadow-xl transition-all flex items-center justify-center transform hover:-translate-y-1 ${
                  isProcessing 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none' 
                    : 'bg-gradient-to-r from-[#FAAC06] to-[#EB8105] hover:shadow-[0_10px_20px_rgba(235,129,5,0.3)] text-white'
                }`}
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {getStatusLabel()}
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    Try It On Now
                  </>
                )}
              </button>

              {/* Queue progress bar (shown while processing) */}
              {isProcessing && (
                <div className="mt-4 w-full">
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-[#FAAC06] to-[#EB8105] h-2 rounded-full animate-pulse" style={{ width: "100%" }} />
                  </div>
                  <p className="text-center text-xs text-gray-500 mt-2">
                    Our AI model is working on your look — this may take 2–5 minutes on busy servers. Please don't close this tab.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center flex-grow bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 p-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <p className="text-gray-400 font-medium">Please provide your {mode === "photo" ? "photo" : "video"}</p>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 flex flex-col">
          <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
            <h3 className="text-2xl font-bold text-gray-800">Garment</h3>
            <span className="bg-blue-100 text-blue-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Step 2</span>
          </div>
          {tryOn.clothUrl ? (
            <div className="flex-grow flex items-center justify-center bg-gray-50 rounded-2xl p-4">
              <img 
                src={tryOn.clothUrl} 
                alt="Cloth" 
                className="w-full max-h-80 object-contain drop-shadow-xl hover:scale-105 transition-transform duration-500"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center flex-grow bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 p-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p className="text-gray-400 font-medium">No clothing selected</p>
              <p className="text-gray-400 text-sm mt-1">Go to a product page and click "Virtual Try On"</p>
            </div>
          )}
        </div>
      </div>

      {tryOn.imageUrl && (
        <div className="bg-white p-10 rounded-3xl shadow-[0_20px_50px_rgba(250,172,6,0.15)] border-2 border-orange-100 mb-10 transform transition-all duration-500 translate-y-0 opacity-100">
          <div className="text-center mb-8">
            <span className="bg-gradient-to-r from-[#FAAC06] to-[#EB8105] text-white text-sm font-bold px-4 py-2 rounded-full uppercase tracking-widest shadow-md">Ta-da!</span>
            <h3 className="text-3xl font-extrabold text-gray-800 mt-4">Your Stunning Look</h3>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="relative p-2 bg-gradient-to-br from-orange-100 to-white rounded-[2rem] shadow-inner mb-8">
              {tryOn.imageUrl.match(/\.(mp4|webm|mov)$/i) || mode === "video" ? (
                <video 
                  src={tryOn.imageUrl} 
                  controls 
                  autoPlay 
                  loop 
                  className="max-w-full max-h-[700px] object-cover rounded-[1.5rem] shadow-2xl"
                />
              ) : (
                <img 
                  src={tryOn.imageUrl} 
                  alt="Virtual Try-On Result" 
                  className="max-w-full max-h-[700px] object-cover rounded-[1.5rem] shadow-2xl"
                />
              )}
            </div>
            
            <a href={tryOn.imageUrl} download target="_blank" rel="noopener noreferrer" className="px-10 py-4 bg-gray-900 text-white rounded-full font-bold shadow-xl hover:bg-black hover:shadow-2xl transition-all transform hover:-translate-y-1 flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              <span>Download High-Res Result</span>
            </a>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-8 p-5 bg-red-50 border-l-4 border-red-500 rounded-r-xl shadow-md">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-red-100 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="ml-4 text-red-800 font-bold text-lg">{error}</p>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default Page;