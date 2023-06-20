/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(() => {
  return {
    server: {
      //   open: true, /*opens up the browser */
      hmr: { overlay: false },
    },
    build: {
      outDir: "build",
    },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: ["./src/setupTests.ts"],
      coverage: {
        provider: "v8",
        reporter: ["text", "json", "html"],
        reportsDirectory: "./__tests__/coverage" /*coverage report*/,
      },
    },
    plugins: [react()],
  };
});
