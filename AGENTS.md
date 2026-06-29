# Agent Guidelines
## Rule for every task
1. ALWAYS read brain/master-memory.md first before any code analysis.
2. Only read additional brain/*.md files if relevant to the current task.
3. Do NOT scan the full repository unless brain files are missing the needed info.
4. After completing a task, update the relevant brain/*.md file with what changed.

## Tech Stack
- Frontend: React 18, Next.js / Vite, Tailwind CSS
- Backend: Node.js, Express, TypeScript, MongoDB, Redis
- Real-time: Socket.io

## Folder Structure
- `Trialshopy_Frontend_25-main`: Customer Next.js App
- `Trialshopy-backend-master`: Customer Node.js API
- `SELLER-ADMIN-DASHBOARD-main`: Seller Vite App
- `Seller-Admin-Backend-main`: Seller Node.js API
- `Super-Admin-main`: Super Admin Vite App
- `brain/`: Persistent knowledge base. Read `master-memory.md` before tasks.

## Conventions
- Use standard React functional components.
- Use Tailwind CSS for styling in new components.
- Ensure API calls use environment variables for base URLs.
- Always update `brain/` documents when you resolve bugs or add significant features.
