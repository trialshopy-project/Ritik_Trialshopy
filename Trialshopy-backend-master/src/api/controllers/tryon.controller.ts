import { Request, Response } from "express";
import axios from "axios";
import { v2 as cloudinary } from "cloudinary";
import { GradioTryOnService } from "../../services/gradioTryOn.service";

// Allowed MIME type prefixes for the Gradio endpoint (no videos)
const ALLOWED_IMAGE_PREFIXES = [
  "data:image/jpeg",
  "data:image/jpg",
  "data:image/png",
  "data:image/webp",
];

export class TryonController {
  /**
   * Original FitRoom-based try-on (kept for backward-compatibility).
   */
  public static async generateTryOn(req: Request, res: Response) {
    try {
      const { personImage, garmentImage } = req.body;
      if (!personImage || !garmentImage) {
        return res.status(400).json({ success: false, message: "Missing personImage or garmentImage" });
      }

      // 1. Resize garmentImage to 1024px
      const resizedGarment = garmentImage.replace('/image/upload/', '/image/upload/c_scale,w_1024/');

      // 2. Upload personImage/video to Cloudinary if it's base64 or a local blob
      let finalPersonImageUrl = personImage;
      const isVideo = personImage.startsWith("data:video");
      if (personImage.startsWith("data:image") || isVideo) {
        const uploadRes = await cloudinary.uploader.upload(personImage, { 
          folder: "virtual_tryon",
          resource_type: "auto"
        });
        finalPersonImageUrl = uploadRes.secure_url;
      }

      // 3. Call FitRoom API
      const fitroomBaseUrl = process.env.FITROOM_BASE_URL || "https://api.fitroom.com";
      const fitroomApiKey = process.env.FITROOM_API_KEY;

      if (!fitroomApiKey) {
        console.error("FITROOM_API_KEY is not configured.");
        return res.status(500).json({ success: false, message: "Try-on unavailable right now" });
      }

      const payload: any = { garment_image: resizedGarment };
      if (isVideo) {
        payload.person_video = finalPersonImageUrl;
      } else {
        payload.person_image = finalPersonImageUrl;
      }

      const createResponse = await axios.post(
        `${fitroomBaseUrl}/api/tryon/v2/tasks`,
        payload,
        {
          headers: {
            "X-API-KEY": fitroomApiKey,
            "Content-Type": "application/json"
          }
        }
      );

      const taskId = createResponse.data.task_id || createResponse.data.id;
      if (!taskId) {
        console.error("Failed to retrieve task ID from FitRoom API", createResponse.data);
        return res.status(500).json({ success: false, message: "Failed to create try-on task" });
      }

      // 4. Poll for completion
      let isComplete = false;
      let resultUrl = "";
      let attempts = 0;
      const maxAttempts = 20; // 60 seconds max if 3s delay

      while (!isComplete && attempts < maxAttempts) {
        attempts++;
        await new Promise((resolve) => setTimeout(resolve, 3000)); // 3s delay

        const statusResponse = await axios.get(`${fitroomBaseUrl}/api/tryon/v2/tasks/${taskId}`, {
          headers: { "X-API-KEY": fitroomApiKey }
        });

        const status = statusResponse.data.status;
        if (status === "completed" || status === "success") {
          isComplete = true;
          resultUrl = statusResponse.data.result_url || statusResponse.data.output_image || statusResponse.data.result_image;
        } else if (status === "failed" || status === "error") {
          console.error("FitRoom task failed", statusResponse.data);
          return res.status(500).json({ success: false, message: "Try-on unavailable right now" });
        }
      }

      if (!resultUrl) {
        console.error("FitRoom task timed out.");
        return res.status(500).json({ success: false, message: "Try-on unavailable right now" });
      }

      return res.status(200).json({ success: true, resultUrl });

    } catch (error: any) {
      console.error("FitRoom TryOn Error:", error.response?.data || error.message);
      return res.status(500).json({ success: false, message: "Try-on unavailable right now" });
    }
  }

  /**
   * Dedicated endpoint to upload a person image to Cloudinary.
   * Accepts a base64 data URI, uploads with retry logic, returns the secure URL.
   *
   * POST /api/v1/tryon/upload-person
   * Body: { personImage: "data:image/jpeg;base64,..." }
   * Returns: { success: true, url: string }
   */
  public static async uploadPersonImage(req: Request, res: Response) {
    try {
      const { personImage } = req.body;

      if (!personImage || typeof personImage !== "string") {
        return res.status(400).json({ success: false, message: "personImage (base64 data URI) is required." });
      }

      if (!personImage.startsWith("data:image")) {
        // If it's already a URL, just return it
        return res.status(200).json({ success: true, url: personImage });
      }

      const url = await GradioTryOnService.uploadPersonImage(personImage);
      return res.status(200).json({ success: true, url });

    } catch (error: any) {
      console.error("[TryonController] uploadPersonImage Error:", error.message);
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to upload person image. Please check your connection and try again.",
      });
    }
  }

  /**
   * Gradio Queue API-based virtual try-on.
   *
   * Expected request body:
   *   personImage  {string}  Base64 data URI (image/jpeg|png|webp) or a public URL
   *   garmentImage {string}  Public URL of the garment/product image
   *
   * Returns:
   *   { success: true,  resultUrl: string }
   *   { success: false, message: string   }
   */
  public static async generateGradioTryOn(req: Request, res: Response) {
    try {
      const { personImage, garmentImage } = req.body;

      // ── Validation ──────────────────────────────────────────────────────────
      if (!personImage || !garmentImage) {
        return res.status(400).json({
          success: false,
          message: "Both personImage and garmentImage are required.",
        });
      }

      // Reject video inputs — Gradio endpoint is photo-only
      if (personImage.startsWith("data:video")) {
        return res.status(400).json({
          success: false,
          message: "Video inputs are not supported. Please upload a photo.",
        });
      }

      // Validate MIME type for base64 uploads (URLs pass through unchecked)
      if (
        personImage.startsWith("data:") &&
        !ALLOWED_IMAGE_PREFIXES.some((p) => personImage.startsWith(p))
      ) {
        return res.status(400).json({
          success: false,
          message: "Unsupported image format. Please upload a JPEG, PNG, or WebP image.",
        });
      }

      if (typeof garmentImage !== "string" || garmentImage.trim() === "") {
        return res.status(400).json({
          success: false,
          message: "garmentImage must be a valid non-empty URL.",
        });
      }

      // ── Call Gradio Service ─────────────────────────────────────────────────
      console.info(
        "[TryonController] Gradio try-on requested. garment=%s",
        garmentImage.substring(0, 100)
      );

      const { resultUrl } = await GradioTryOnService.generate(
        personImage,
        garmentImage
      );

      console.info("[TryonController] Gradio try-on succeeded. resultUrl=%s", resultUrl);
      return res.status(200).json({ success: true, resultUrl });

    } catch (error: any) {
      console.error("[TryonController] Gradio TryOn Error:", error.message);
      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Virtual Try-On is unavailable right now. Please try again later.",
      });
    }
  }
}
