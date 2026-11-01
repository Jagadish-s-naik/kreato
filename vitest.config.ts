import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
      "@/frontend": path.resolve(__dirname, "./frontend"),
      "@/backend": path.resolve(__dirname, "./backend"),
      "@/lib": path.resolve(__dirname, "./lib"),
    },
  },
});

