import { validateWorldModule, type WorldModule } from "@modelverse/world-sdk";
export const assertWorldCompatible = async (module: WorldModule): Promise<void> => {
  validateWorldModule(module, module.manifest.id);
  const controller = new AbortController();
  const assets = await module.preload({
    signal: controller.signal,
    reportProgress: () => undefined,
  });
  assets.dispose();
};
