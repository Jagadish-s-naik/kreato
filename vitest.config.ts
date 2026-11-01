import { defineConfig } from "vitest/config";
import path from "path";

process.loadEnvFile?.(".env.local");

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
  },
  resolve: {
    alias: {
      "server-only": path.resolve(__dirname, "./tests/server-only-stub.ts"),
      "@": path.resolve(__dirname, "./"),
      "@/frontend": path.resolve(__dirname, "./frontend"),
      "@/backend": path.resolve(__dirname, "./backend"),
      "@/lib": path.resolve(__dirname, "./lib"),
    },
  },
});

