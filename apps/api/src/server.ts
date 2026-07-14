import { PrismaClient } from "@prisma/client";
import { createApp } from "./app.js";
import { readEnvironment } from "./env.js";
const env = readEnvironment();
const prisma = new PrismaClient();
const app = createApp({
  repository: prisma,
  corsOrigin: env.CORS_ORIGIN,
  logLevel: env.LOG_LEVEL,
});
const server = app.listen(env.PORT, () =>
  console.info(`Modelverse API listening on ${env.PORT}`),
);
const shutdown = (signal: string) => {
  console.info(`Received ${signal}; shutting down`);
  server.close((error) => {
    void prisma.$disconnect().finally(() => {
      if (error !== undefined) {
        console.error("HTTP shutdown failed", error);
        process.exitCode = 1;
      }
    });
  });
};
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
