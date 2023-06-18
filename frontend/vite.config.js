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
    plugins: [react()],
  };
});
