import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import basicSsl from "@vitejs/plugin-basic-ssl";

export default defineConfig({
  build: {
    emptyOutDir: false,
    target: "esnext",
    rollupOptions: {
      input: {
        weeklyBusinessReview: "src/viz/weeklyBusinessReview/main.ts",
      },
      output: {
        entryFileNames: "[name].js",
      },
    },
  },
  preview: {
    https: true,
  },
  plugins: [react(), basicSsl()],
});
