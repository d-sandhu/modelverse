import { describe, expect, it } from "vitest";
import { isWorldRegistered, loadRegisteredWorld, worldRegistry } from "./registry";

describe("empty world registry", () => {
  it("ships without platform-authored worlds", () => {
    expect(Object.keys(worldRegistry)).toEqual([]);
    expect(isWorldRegistered("example-world")).toBe(false);
  });

  it("rejects packages that were not explicitly registered", async () => {
    await expect(loadRegisteredWorld("example-world")).rejects.toThrow(
      "World example-world is not in the local registry",
    );
  });
});
