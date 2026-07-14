import { describe, expect, it } from "vitest";
import { validateWorldModule, worldManifestSchema } from "./index";

describe("World SDK validation", () => {
  it("accepts a valid manifest", () => {
    expect(
      worldManifestSchema.parse({
        id: "test-world",
        title: "Test",
        description: "Test world",
        version: "0.1.0",
        sdkVersion: "0.1",
        capabilities: ["custom-controls"],
        defaultEntryPointId: "start",
        provenancePath: "world.provenance.json",
      }).id,
    ).toBe("test-world");
  });
  it("rejects registry identity mismatches", () => {
    expect(() =>
      validateWorldModule(
        {
          manifest: {
            id: "one",
            title: "One",
            description: "One world",
            version: "1",
            sdkVersion: "0.1",
            capabilities: [],
            defaultEntryPointId: "start",
            provenancePath: "p.json",
          },
          entryPoints: [
            { id: "start", transform: { position: [0, 0, 0], rotation: [0, 0, 0, 1] } },
          ],
          preload: async () => ({ dispose: () => undefined }),
          create: async () => {
            throw new Error("not needed");
          },
        },
        "two",
      ),
    ).toThrow(/does not match/);
  });
});
