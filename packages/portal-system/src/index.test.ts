import type { PortalDefinition } from "@modelverse/world-sdk";
import { describe, expect, it } from "vitest";
import { hasCrossedPortal, mapTransformThroughPortal, transitionPortal } from "./index";
const portal: PortalDefinition = {
  id: "p",
  label: "P",
  destinationWorldId: "b",
  destinationEntryPointId: "start",
  transform: { position: [0, 1, 0], rotation: [0, 0, 0, 1] },
  dimensions: { width: 4, height: 4 },
  preloadRadius: 10,
  previewRadius: 5,
};
describe("portal geometry and lifecycle", () => {
  it("detects bounded plane crossings", () => {
    expect(hasCrossedPortal([0, 1, 1], [0, 1, -1], portal)).toBe(true);
    expect(hasCrossedPortal([4, 1, 1], [4, 1, -1], portal)).toBe(false);
  });
  it("rejects invalid state transitions", () => {
    expect(() =>
      transitionPortal({ status: "dormant", progress: 0 }, "crossing"),
    ).toThrow(/Invalid/);
    expect(
      transitionPortal({ status: "dormant", progress: 0 }, "prefetching-code", 0.2),
    ).toEqual({ status: "prefetching-code", progress: 0.2 });
  });
  it("maps relative transforms", () => {
    const mapped = mapTransformThroughPortal(
      { position: [1, 0, 2], rotation: [0, 0, 0, 1] },
      { position: [0, 0, 0], rotation: [0, 0, 0, 1] },
      { position: [10, 0, 0], rotation: [0, 0, 0, 1] },
    );
    expect(mapped.position).toEqual([11, 0, 2]);
  });
});
