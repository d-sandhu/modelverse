import { z } from "zod";
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(3001),
  DATABASE_URL: z
    .string()
    .url()
    .or(z.string().startsWith("postgresql://"))
    .default("postgresql://modelverse:modelverse@localhost:5432/modelverse"),
  CORS_ORIGIN: z.string().url().default("http://localhost:5173"),
  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"])
    .default("info"),
});
export type ApiEnvironment = z.infer<typeof envSchema>;
export const readEnvironment = (
  source: NodeJS.ProcessEnv = process.env,
): ApiEnvironment => envSchema.parse(source);
