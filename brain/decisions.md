# Key Decisions & Rationale

- **Next.js vs Vite**: Next.js is used for the Customer Frontend likely for SEO benefits and SSR capabilities, whereas Vite is used for the Admin Dashboards where SEO is not a concern and SPA performance is prioritized.
- **MongoDB**: Chosen for flexible schema design and rapid iteration in the e-commerce domain.
- **Redis**: Implemented in the Customer Backend to cache frequent queries (like products and categories) to improve latency.
- **Cloudinary**: Offloads media processing and storage, saving server bandwidth and storage.
- **Socket.io**: Used across the stack for real-time features like chat, notifications, and live order tracking.
