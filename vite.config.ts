import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // 👈 this line maps @ to /src
    },
  },
  publicDir: "public", // ensures everything in public/ is copied to dist/
  build: {
    outDir: "dist", // default Vite build folder
  },
});
