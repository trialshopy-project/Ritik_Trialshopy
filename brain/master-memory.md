# Project Brain - Master Memory

**Read this file FIRST at the start of every session.**

## Overview
Trialshopy is an e-commerce platform consisting of 5 main components:
1. **Customer Frontend**: Next.js application for end-users.
2. **Customer Backend**: Node.js/Express application with MongoDB and Redis.
3. **Seller Admin Dashboard**: Vite/React frontend for sellers to manage their store.
4. **Seller Admin Backend**: Node.js/Express backend for seller operations.
5. **Super Admin Dashboard**: Vite/React frontend for platform administrators.

## Architecture Highlights
- **Frontend Stack**: React 18, Next.js (Customer) / Vite (Admins), Tailwind CSS, Firebase (Auth/Notifications), Socket.io (Real-time).
- **Backend Stack**: Node.js, Express, MongoDB (Mongoose), Redis (Caching), Cloudinary (Media), Razorpay (Payments), Socket.io (WebSockets).

## Key Patterns
- **Auth**: JWT based authentication (Backend), Firebase Auth integration in some frontends.
- **API**: RESTful APIs with Axios in frontends.
- **State/UI**: Tailwind CSS for styling, Ant Design / MUI used in admin panels.

## Known Issues & Roadmaps
- (To be updated as issues are encountered and resolved)

## Recent Features
- **Gradio Queue API Virtual Try-On (CatVTON)**: No GPU locally (CPU-only). Created `tryon_server.py` - a Flask bridge that wraps `gradio_client` to call the CatVTON HF Space (`zhengchong/CatVTON`). Exposes `/trial/api/join_queue/` and `/trial/api/queue_data/` endpoints at `http://127.0.0.1:8000`. Start with `start_tryon.bat`. Backend polls up to 6 min (72 x 5s). Frontend timeout is 7 min. `VIRTUAL_TRYON_API=http://127.0.0.1:8000` in backend `.env`. All files: `tryon_server.py`, `tryon_requirements.txt`, `start_tryon.bat`, `src/services/gradioTryOn.service.ts`, `src/api/controllers/tryon.controller.ts`, `POST /api/v1/tryon/gradio` route.
- **Gradio Try-On ECONNRESET Fix**: Cloudinary upload of person image was failing with ECONNRESET due to large base64 payload. Fixed by: (1) `gradioTryOn.service.ts` now uses `upload_stream` (Buffer-based) with 3 retry attempts instead of `uploader.upload(base64string)`. (2) New `POST /api/v1/tryon/upload-person` endpoint dedicated to uploading the person image with retry logic. (3) Frontend `virtualTryOn/page.jsx` now performs a 2-step process: upload person image first (up to 3 retries), then call gradio with the resulting Cloudinary URL instead of raw base64.
- **Video Try-On**: Expanded the Virtual Try-On page to support videos. Added a toggle between Photo and Video try-on. Backend `tryon.controller.ts` modified to handle video payload correctly (Cloudinary `resource_type: auto` and FitRoom `person_video` key).
- **FitRoom Virtual Try-On**: Replaced Hugging Face integration with FitRoom API. Created `/api/v1/tryon/generate` endpoint in backend that scales garment images to 1024px, uploads person images, and polls FitRoom. Frontend `virtualTryOn` page updated to use this endpoint.
- **Virtual Try-On Image**: Added an optional upload for Virtual Try-On images in Seller Admin Dashboard. Modifies `product.model.ts` (adding `tryOnImage` and `tryOnEnabled`) and shows a "Try It On" button on the customer frontend's product details page.

## Update Rule
After finishing any task (bug fix, new feature), **update this and the relevant brain files** with what changed.

## Security Notes
- **GitHub Push Protection Fix (2026-06-30)**: Removed all hardcoded secret fallbacks from source files. Affected: `loginAuth.service.ts`, `testOtp.controller.ts`, `database.config.ts`, `app.ts`, `download.contoller.ts`, `upload.middleware.ts` (customer backend) and `sellerAuth.controller.ts` (seller backend). All now use strict `process.env.VAR!` with no fallback. `.env.example` files added to both backends. Git history rewritten via `git commit --amend` (old hash: `4e2af26` → new: `3eba13e`). Force push required: `git push --force-with-lease origin main`.
- **Frontend URL Refactor (2026-06-30)**: Removed all hardcoded `localhost` and `onrender.com` URLs across `Trialshopy_Frontend_25-main`, `SELLER-ADMIN-DASHBOARD-main`, and `Super-Admin-main`. All frontends now strictly use environment variables (`process.env.NEXT_PUBLIC_*` or `import.meta.env.*`) for backend and seller endpoints, making them production-ready for deployment.
