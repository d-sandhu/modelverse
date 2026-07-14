import type { WorldSaveData } from "@modelverse/world-sdk";
import { z } from "zod";

export type GlobalSaveData = {
  schemaVersion: number;
  currentWorldId: string;
  currentEntryPointId: string;
  worldsVisited: string[];
  worldStates: Record<string, WorldSaveData>;
  settings: {
    masterVolume: number;
    graphicsQuality: "low" | "medium" | "high";
    reducedMotion: boolean;
  };
};
export const globalSaveSchema: z.ZodType<GlobalSaveData> = z.object({
  schemaVersion: z.number().int().positive(),
  currentWorldId: z.string(),
  currentEntryPointId: z.string(),
  worldsVisited: z.array(z.string()),
  worldStates: z.record(
    z.object({
      schemaVersion: z.number().int().nonnegative(),
      value: z.record(z.unknown()),
    }),
  ),
  settings: z.object({
    masterVolume: z.number().min(0).max(1),
    graphicsQuality: z.enum(["low", "medium", "high"]),
    reducedMotion: z.boolean(),
  }),
});
