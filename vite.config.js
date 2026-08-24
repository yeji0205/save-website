import { defineConfig } from "vite";

import { resolve } from "node:path";

export default defineConfig({
  // Relative paths so the built site works from any subfolder (e.g. GitHub Pages).
  base: "./",
  build: {
    // Two pages, so both need listing as entry points.
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        imprint: resolve(__dirname, "imprint.html"),
      },
    },
  },
  server: {
    port: 5173,
    open: true,
  },
});
