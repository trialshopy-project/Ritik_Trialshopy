# Dependency Graph

How the 5 layers connect:

- **Customer Frontend** `<-->` **Customer Backend**
  - REST API calls for products, cart, checkout, user profile.
  - WebSocket connection for live updates.
- **Seller Admin Dashboard** `<-->` **Seller Admin Backend**
  - REST API calls for store management, product inventory, order fulfillment.
- **Super Admin** `<-->` **Customer/Seller Backends** (or specific Admin API)
  - Manages overarching platform data, approves sellers, views analytics.
- **Customer Backend** `<-->` **External Services**
  - MongoDB (Primary Database)
  - Redis (Cache)
  - Razorpay (Payments)
  - Cloudinary (Media Storage)
