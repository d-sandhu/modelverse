import { provenanceSchema } from "@modelverse/provenance";
import { assertWorldCompatible } from "@modelverse/testing";
import type { InputService, RawInputState } from "@modelverse/world-sdk";
import { describe, expect, it } from "vitest";
import provenance from "../world.provenance.json";
import world from "./index";

const inputState: RawInputState = {
  keysDown: new Set(),
  buttonsDown: new Set(),
  pointer: { x: 0, y: 0, deltaX: 0, deltaY: 0, isDown: false },
  touches: [],
  wheelDelta: 0,
  gamepads: [],
};

const input: InputService = {
  getState: () => inputState,
  consumePointerDelta: () => ({ x: 0, y: 0 }),
  requestPointerLock: async () => undefined,
  releasePointerLock: () => undefined,
  setCursorVisible: () => undefined,
};

describe("world package template", () => {
  it("satisfies manifest, preload, and provenance contracts", async () => {
    await assertWorldCompatible(world);
    expect(provenanceSchema.parse(provenance).worldId).toBe(world.manifest.id);
  });

  it("supports a complete and idempotent empty lifecycle", async () => {
    const session = await world.create({
      registerPortal: () => () => undefined,
      requestTravel: async () => undefined,
      reportScore: () => undefined,
      setLocalHud: () => undefined,
      logEvent: () => undefined,
      environment: {
        input,
        quality: () => ({ level: "low", reducedMotion: false }),
      },
    });

    await session.enter({ entryPointId: world.manifest.defaultEntryPointId });
    session.update({ deltaSeconds: 1 / 60, elapsedSeconds: 1 });
    expect(session.serialize()).toEqual({ schemaVersion: 1, value: {} });
    await session.exit({ reason: "application-exit" });
    expect(() => {
      session.dispose();
      session.dispose();
    }).not.toThrow();
  });
});
