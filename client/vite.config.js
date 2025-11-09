// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// ✅ Polyfill global variables like `global` and `Buffer`
export default defineConfig({
  plugins: [react()],
  define: {
    global: "globalThis", // make `global` available for simple-peer
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      process: "process/browser",
      buffer: "buffer",
    },
  },
  optimizeDeps: {
    include: ["buffer", "process"],
  },
});
