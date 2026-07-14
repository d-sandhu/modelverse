import { describe, expect, it } from "vitest";
import { provenanceSchema } from "./index";
describe("provenance", () => {
  it("allows unknown values to remain explicitly unknown", () => {
    const value = provenanceSchema.parse({
      schemaVersion: 1,
      worldId: "test-world",
      model: null,
      tool: null,
      skillsUsed: [],
      startDate: null,
      completionDate: null,
      promptCount: null,
      agentRuns: null,
      humanHours: null,
      humanInterventions: null,
      tokenUsage: null,
      estimatedCostUsd: null,
      commitRange: null,
      screenshots: [],
      performanceMeasurements: [],
    });
    expect(value.model).toBeNull();
  });
});
