import { z } from "zod";
const measuredNumber = z.object({
  value: z.number().nonnegative(),
  basis: z.enum(["measured", "estimated"]),
});
export const provenanceSchema = z.object({
  schemaVersion: z.literal(1),
  worldId: z.string().min(1),
  model: z.string().nullable(),
  tool: z.string().nullable(),
  skillsUsed: z.array(z.string()),
  startDate: z.string().nullable(),
  completionDate: z.string().nullable(),
  promptCount: z.number().int().nonnegative().nullable(),
  agentRuns: z.number().int().nonnegative().nullable(),
  humanHours: measuredNumber.nullable(),
  humanInterventions: z.number().int().nonnegative().nullable(),
  tokenUsage: measuredNumber.nullable(),
  estimatedCostUsd: measuredNumber.nullable(),
  commitRange: z.string().nullable(),
  screenshots: z.array(z.string()),
  performanceMeasurements: z.array(
    z.object({
      device: z.string(),
      metric: z.string(),
      value: z.number(),
      unit: z.string(),
      basis: z.enum(["measured", "estimated"]),
    }),
  ),
});
export type Provenance = z.infer<typeof provenanceSchema>;
