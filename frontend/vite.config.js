import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  esbuild: { jsx: "automatic" },
  test: {
    environment: "jsdom",
    setupFiles: "./src/tests/setup.js",
    restoreMocks: true,
    include: ["src/tests/**/*.{test,spec}.{js,jsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json-summary"],
      include: ["src/**/*.{js,jsx}"],
      exclude: ["src/tests/**", "src/main.jsx", "src/data/**"],
    },
  },
});
