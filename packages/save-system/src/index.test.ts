import { describe, expect, it } from "vitest";
import { createDefaultSave, migrateSave } from "./index";
describe("save schemas", () => {
  it("starts with no platform-authored world selected", () => {
    const save = migrateSave(createDefaultSave());
    expect(save.schemaVersion).toBe(1);
    expect(save.currentWorldId).toBe("");
    expect(save.worldsVisited).toEqual([]);
  });
  it("recovers by rejecting unsupported versions", () =>
    expect(() => migrateSave({ schemaVersion: 99 })).toThrow(/Unsupported/));
});
