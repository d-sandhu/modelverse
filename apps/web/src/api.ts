import { z } from "zod";
const healthSchema = z.object({ status: z.literal("ok"), service: z.string() });
export type ApiStatus = "checking" | "available" | "offline";
export const checkApiHealth = async (
  baseUrl = import.meta.env.VITE_API_URL ?? "",
): Promise<ApiStatus> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 1800);
  try {
    const response = await fetch(`${baseUrl}/health`, { signal: controller.signal });
    if (!response.ok) return "offline";
    healthSchema.parse(await response.json());
    return "available";
  } catch (error) {
    console.info("Optional API is unavailable; local play remains enabled", error);
    return "offline";
  } finally {
    clearTimeout(timeout);
  }
};
