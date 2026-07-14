import { describe, expect, it } from "vitest";
import { degradeQuality, qualityPreset, selectInitialQuality } from "./index";
describe("device quality", () => {
  it("starts conservatively on mobile", () =>
    expect(selectInitialQuality(true, 3, false).level).toBe("low"));
  it("degrades previews and pixel ratio", () => {
    const degraded = degradeQuality(qualityPreset("high"));
    expect(degraded.level).toBe("medium");
    expect(degraded.portalPreview).toBe("static");
    expect(degraded.pixelRatio).toBeLessThan(2);
  });
  it("respects reduced motion", () =>
    expect(selectInitialQuality(false, 1, true).postProcessing).toBe(false));
});
