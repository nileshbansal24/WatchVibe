import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// Vite configuration for building the VibeWatch Chrome extension.
// The popup is compiled into a single HTML + JS bundle that the
// manifest points to as `default_popup`.
export default defineConfig({
  plugins: [react()],
  // Relative paths are required so the compiled popup can load its
  // JS/CSS from inside the extension package (absolute "/" paths fail).
  base: "./",
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "index.html"),
      },
      output: {
        entryFileNames: "assets/[name].js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: "assets/[name].[ext]",
      },
    },
  },
});
