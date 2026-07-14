import type { WorldController, WorldModule } from "@modelverse/world-sdk";
import { PerspectiveCamera, Scene } from "three";
const template: WorldModule = {
  manifest: {
    id: "template",
    title: "World template",
    description: "Copy-only starting point for authored worlds.",
    version: "0.1.0",
    sdkVersion: "0.1",
    capabilities: [],
    defaultEntryPointId: "start",
    provenancePath: "world.provenance.json",
  },
  entryPoints: [
    { id: "start", transform: { position: [0, 0, 0], rotation: [0, 0, 0, 1] } },
  ],
  preload: async ({ signal, reportProgress }) => {
    if (signal.aborted) throw new DOMException("Preload aborted", "AbortError");
    reportProgress({ stage: "complete", progress: 1 });
    return { dispose: () => undefined };
  },
  create: async () => {
    const scene = new Scene();
    const camera = new PerspectiveCamera();
    let enabled = false;
    const controller: WorldController = {
      enable: () => {
        enabled = true;
      },
      disable: () => {
        enabled = false;
      },
      update: () => undefined,
      getPlayerTransform: () => ({ position: [0, 0, 0], rotation: [0, 0, 0, 1] }),
      setPlayerTransform: () => undefined,
      dispose: () => {
        enabled = false;
      },
    };
    return {
      scene,
      camera,
      controller,
      enter: () => controller.enable(),
      exit: () => controller.disable(),
      update: (frame) => {
        if (enabled) controller.update(frame);
      },
      resize: () => undefined,
      serialize: () => ({ schemaVersion: 1, value: {} }),
      dispose: () => {
        controller.dispose();
        scene.clear();
      },
    };
  },
};
export default template;
