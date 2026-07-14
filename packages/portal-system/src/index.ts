import type {
  PortalDefinition,
  Vector3Tuple,
  WorldTransform,
} from "@modelverse/world-sdk";
import { Matrix4, Plane, Quaternion, Vector3 } from "three";

export type PortalStatus =
  | "dormant"
  | "prefetching-code"
  | "preloading-assets"
  | "initializing-world"
  | "preview-ready"
  | "crossing"
  | "active"
  | "cooling-down"
  | "failed";
export type PortalRuntimeState = {
  status: PortalStatus;
  progress: number;
  errorMessage?: string;
};
const transitions: Record<PortalStatus, readonly PortalStatus[]> = {
  dormant: ["prefetching-code"],
  "prefetching-code": ["preloading-assets", "failed", "dormant"],
  "preloading-assets": ["initializing-world", "failed", "dormant"],
  "initializing-world": ["preview-ready", "failed"],
  "preview-ready": ["crossing", "dormant", "failed"],
  crossing: ["active", "failed"],
  active: ["cooling-down"],
  "cooling-down": ["dormant"],
  failed: ["prefetching-code", "dormant"],
};
export const transitionPortal = (
  state: PortalRuntimeState,
  status: PortalStatus,
  progress = state.progress,
): PortalRuntimeState => {
  if (!transitions[state.status].includes(status))
    throw new Error(`Invalid portal transition: ${state.status} -> ${status}`);
  return { status, progress: Math.max(0, Math.min(1, progress)) };
};
const tuple = (vector: Vector3): Vector3Tuple => [vector.x, vector.y, vector.z];
export const hasCrossedPortal = (
  previous: Vector3Tuple,
  current: Vector3Tuple,
  portal: PortalDefinition,
): boolean => {
  const position = new Vector3(...portal.transform.position);
  const rotation = new Quaternion(...portal.transform.rotation);
  const normal = new Vector3(0, 0, 1).applyQuaternion(rotation);
  const plane = new Plane().setFromNormalAndCoplanarPoint(normal, position);
  const from = new Vector3(...previous);
  const to = new Vector3(...current);
  const fromDistance = plane.distanceToPoint(from);
  const toDistance = plane.distanceToPoint(to);
  if (
    fromDistance === 0 ||
    toDistance === 0 ||
    Math.sign(fromDistance) === Math.sign(toDistance)
  )
    return false;
  const alpha = fromDistance / (fromDistance - toDistance);
  const hit = from
    .clone()
    .lerp(to, alpha)
    .sub(position)
    .applyQuaternion(rotation.clone().invert());
  return (
    Math.abs(hit.x) <= portal.dimensions.width / 2 &&
    Math.abs(hit.y) <= portal.dimensions.height / 2
  );
};
export const mapTransformThroughPortal = (
  player: WorldTransform,
  source: WorldTransform,
  destination: WorldTransform,
): WorldTransform => {
  const sourceMatrix = new Matrix4().compose(
    new Vector3(...source.position),
    new Quaternion(...source.rotation),
    new Vector3(1, 1, 1),
  );
  const destinationMatrix = new Matrix4().compose(
    new Vector3(...destination.position),
    new Quaternion(...destination.rotation),
    new Vector3(1, 1, 1),
  );
  const playerMatrix = new Matrix4().compose(
    new Vector3(...player.position),
    new Quaternion(...player.rotation),
    new Vector3(1, 1, 1),
  );
  const mapped = destinationMatrix
    .clone()
    .multiply(sourceMatrix.clone().invert())
    .multiply(playerMatrix);
  const position = new Vector3();
  const rotation = new Quaternion();
  mapped.decompose(position, rotation, new Vector3());
  return {
    position: tuple(position),
    rotation: [rotation.x, rotation.y, rotation.z, rotation.w],
  };
};
export type PortalPreviewMode = "shader" | "static" | "live";
export type PortalPreviewTarget = { width: number; height: number; dispose: () => void };
export const createPreviewTargetDescriptor = (
  mode: PortalPreviewMode,
  viewportWidth: number,
): PortalPreviewTarget | null =>
  mode === "shader"
    ? null
    : {
        width: Math.min(
          mode === "live" ? 512 : 256,
          Math.max(128, Math.round(viewportWidth / 3)),
        ),
        height: Math.min(
          mode === "live" ? 512 : 256,
          Math.max(128, Math.round(viewportWidth / 3)),
        ),
        dispose: () => undefined,
      };
