import { validateWorldModule, type WorldRegistry } from "@modelverse/world-sdk";

// Model-authored world packages are added here by an explicit platform change.
// Keeping this registry local prevents arbitrary remote JavaScript execution.
export const worldRegistry: WorldRegistry = {};

export const isWorldRegistered = (worldId: string): boolean =>
  worldRegistry[worldId] !== undefined;

export const loadRegisteredWorld = async (worldId: string) => {
  const loader = worldRegistry[worldId];
  if (loader === undefined)
    throw new Error(`World ${worldId} is not in the local registry`);
  return validateWorldModule(await loader(), worldId);
};
