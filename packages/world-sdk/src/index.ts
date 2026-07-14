import type { ReactNode } from "react";
import type * as THREE from "three";
import { z } from "zod";

export type WorldId = string;
export type PortalId = string;
export type EntryPointId = string;
export type Vector3Tuple = readonly [number, number, number];
export type QuaternionTuple = readonly [number, number, number, number];
export type WorldTransform = { position: Vector3Tuple; rotation: QuaternionTuple };
export type WorldCapability =
  | "physics"
  | "custom-controls"
  | "custom-camera"
  | "world-audio"
  | "local-hud"
  | "portal-preview";
export type WorldManifest = {
  id: WorldId;
  title: string;
  description: string;
  version: string;
  sdkVersion: string;
  capabilities: WorldCapability[];
  defaultEntryPointId: EntryPointId;
  provenancePath: string;
  estimatedDownloadBytes?: number;
};
export type WorldEntryPoint = { id: EntryPointId; transform: WorldTransform };
export type WorldSaveData = { schemaVersion: number; value: Record<string, unknown> };
export type WorldFrame = { deltaSeconds: number; elapsedSeconds: number };
export type WorldPreloadProgress = {
  stage: "code" | "assets" | "physics" | "audio" | "initializing" | "complete";
  progress: number;
  loadedBytes?: number;
  totalBytes?: number;
};
export type WorldPreloadContext = {
  signal: AbortSignal;
  reportProgress: (progress: WorldPreloadProgress) => void;
};
export type WorldAssets = { dispose: () => void };
export type WorldController = {
  enable: () => void;
  disable: () => void;
  update: (frame: WorldFrame) => void;
  getPlayerTransform: () => WorldTransform;
  setPlayerTransform: (transform: WorldTransform) => void;
  dispose: () => void;
};
export type WorldEnterContext = {
  entryPointId: EntryPointId;
  previousWorldId?: WorldId;
  restoredState?: WorldSaveData;
};
export type WorldExitReason = "portal" | "restart" | "application-exit" | "fatal-error";
export type WorldExitContext = { reason: WorldExitReason; destinationWorldId?: WorldId };
export type WorldScore = {
  category: string;
  value: number;
  metadata?: Record<string, unknown>;
};
export type WorldRuntimeEvent = {
  name: string;
  properties?: Record<string, string | number | boolean | null>;
};
export type PortalDefinition = {
  id: PortalId;
  label: string;
  destinationWorldId: WorldId;
  destinationEntryPointId: EntryPointId;
  transform: WorldTransform;
  dimensions: { width: number; height: number };
  preloadRadius: number;
  previewRadius: number;
  unloadRadius?: number;
};
export type PortalTravelRequest = {
  sourceWorldId: WorldId;
  sourcePortalId: PortalId;
  destinationWorldId: WorldId;
  destinationEntryPointId: EntryPointId;
  playerTransform: WorldTransform;
};
export type PointerInput = {
  x: number;
  y: number;
  deltaX: number;
  deltaY: number;
  isDown: boolean;
};
export type TouchPoint = {
  id: number;
  x: number;
  y: number;
  startX: number;
  startY: number;
};
export type RawInputState = {
  keysDown: ReadonlySet<string>;
  buttonsDown: ReadonlySet<number>;
  pointer: PointerInput;
  touches: readonly TouchPoint[];
  wheelDelta: number;
  gamepads: readonly Gamepad[];
};
export type InputService = {
  getState: () => RawInputState;
  consumePointerDelta: () => { x: number; y: number };
  requestPointerLock: () => Promise<void>;
  releasePointerLock: () => void;
  setCursorVisible: (visible: boolean) => void;
};
export type WorldEnvironment = {
  input: InputService;
  quality: () => { level: "low" | "medium" | "high"; reducedMotion: boolean };
};
export type WorldCreateContext = {
  registerPortal: (portal: PortalDefinition) => () => void;
  requestTravel: (request: PortalTravelRequest) => Promise<void>;
  reportScore: (score: WorldScore) => void;
  setLocalHud: (hud: ReactNode | null) => void;
  logEvent: (event: WorldRuntimeEvent) => void;
  environment: WorldEnvironment;
};
export type WorldSession = {
  scene: THREE.Scene;
  camera: THREE.Camera;
  reactTree?: ReactNode;
  controller: WorldController;
  enter: (context: WorldEnterContext) => Promise<void> | void;
  exit: (context: WorldExitContext) => Promise<void> | void;
  update: (frame: WorldFrame) => void;
  resize: (width: number, height: number, pixelRatio: number) => void;
  serialize: () => WorldSaveData;
  dispose: () => void;
};
export type WorldModule = {
  manifest: WorldManifest;
  entryPoints: WorldEntryPoint[];
  preload: (context: WorldPreloadContext) => Promise<WorldAssets>;
  create: (context: WorldCreateContext) => Promise<WorldSession>;
};
export type WorldLoader = () => Promise<WorldModule>;
export type WorldRegistry = Record<string, WorldLoader>;

const transformSchema = z.object({
  position: z.tuple([z.number(), z.number(), z.number()]),
  rotation: z.tuple([z.number(), z.number(), z.number(), z.number()]),
});
export const worldManifestSchema = z.object({
  id: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  description: z.string().min(1),
  version: z.string().min(1),
  sdkVersion: z.string().min(1),
  capabilities: z.array(
    z.enum([
      "physics",
      "custom-controls",
      "custom-camera",
      "world-audio",
      "local-hud",
      "portal-preview",
    ]),
  ),
  defaultEntryPointId: z.string().min(1),
  provenancePath: z.string().min(1),
  estimatedDownloadBytes: z.number().int().nonnegative().optional(),
});
export const worldModuleSchema = z.object({
  manifest: worldManifestSchema,
  entryPoints: z
    .array(z.object({ id: z.string().min(1), transform: transformSchema }))
    .min(1),
  preload: z.function(),
  create: z.function(),
});

export const validateWorldModule = (value: unknown, expectedId?: string): WorldModule => {
  const parsed = worldModuleSchema.parse(value);
  if (expectedId !== undefined && parsed.manifest.id !== expectedId) {
    throw new Error(
      `World registry key ${expectedId} does not match manifest ${parsed.manifest.id}`,
    );
  }
  if (
    !parsed.entryPoints.some((entry) => entry.id === parsed.manifest.defaultEntryPointId)
  ) {
    throw new Error(`World ${parsed.manifest.id} has no default entry point`);
  }
  return parsed as WorldModule;
};
