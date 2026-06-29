import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      include: "**/*.{jsx,js}", // Corrected pattern
    }),
  ],
  server: {
    host: true,
    port: 7001,
    hmr: {
      overlay: false,
    },
  },
  define: {
    "process.env": {},
  },
});
