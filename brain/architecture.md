# Architecture Breakdown

## 1. Customer Frontend (`Trialshopy_Frontend_25-main`)
- **Framework**: Next.js (v14.2.3)
- **Styling**: Tailwind CSS
- **Key Libraries**: Axios, Firebase, Socket.io-client, Ant Design.

## 2. Customer Backend (`Trialshopy-backend-master`)
- **Framework**: Node.js with Express & TypeScript
- **Database**: MongoDB (Mongoose)
- **Caching**: Redis (ioredis)
- **Services**: Cloudinary (Image storage), Razorpay (Payments), Twilio (SMS), Nodemailer.

## 3. Seller Admin Dashboard (`SELLER-ADMIN-DASHBOARD-main`)
- **Framework**: Vite + React
- **Styling**: Tailwind CSS
- **Key Libraries**: Axios, Firebase, React Router, Socket.io-client, Recharts, Ant Design.

## 4. Seller Admin Backend (`Seller-Admin-Backend-main`)
- **Framework**: Node.js with Express & TypeScript
- **Database**: MongoDB (Mongoose)
- **Services**: Cloudinary, Nodemailer, Winston (Logging).

## 5. Super Admin (`Super-Admin-main`)
- **Framework**: Vite + React
- **Styling**: Tailwind CSS, Styled Components
- **Key Libraries**: Axios, React Router, MUI, Ant Design, Recharts.
