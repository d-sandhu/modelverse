import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: [
      "apps/web/src/**/*.test.ts",
      "packages/**/*.test.ts",
      "scripts/**/*.test.ts",
      "worlds/**/*.test.ts",
    ],
    coverage: { reporter: ["text", "html"] },
  },
});
