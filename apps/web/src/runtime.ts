import type {
  InputService,
  PortalDefinition,
  PortalTravelRequest,
  WorldModule,
  WorldPreloadProgress,
  WorldSession,
} from "@modelverse/world-sdk";
import { createIndexedDbSaveService } from "@modelverse/save-system";
import type { ReactNode } from "react";
import { isWorldRegistered, loadRegisteredWorld } from "./registry";

export type RuntimeSnapshot = {
  activeWorldId: string;
  loadedWorldIds: string[];
  portalStatus: string;
  progress: number;
  hud: ReactNode | null;
  error: string | null;
  player: string;
  fps: number;
  fade: boolean;
};
type LoadedWorld = {
  module: WorldModule;
  session: WorldSession;
  assets: { dispose: () => void };
  lastUsed: number;
  hud: ReactNode | null;
};
export type Runtime = ReturnType<typeof createRuntime>;
export const createRuntime = (
  input: InputService,
  quality: () => { level: "low" | "medium" | "high"; reducedMotion: boolean },
  onChange: (snapshot: RuntimeSnapshot) => void,
) => {
  const saveService = createIndexedDbSaveService();
  const loaded = new Map<string, LoadedWorld>();
  const portals = new Map<string, PortalDefinition>();
  let active: LoadedWorld | null = null;
  let activeWorldId = "none";
  let portalStatus = "dormant";
  let progress = 0;
  let hud: ReactNode | null = null;
  let error: string | null = null;
  let fade = false;
  let elapsed = 0;
  let frames = 0;
  let fps = 0;
  let lastFpsAt = 0;
  let disposed = false;
  const emit = () =>
    onChange({
      activeWorldId,
      loadedWorldIds: [...loaded.keys()],
      portalStatus,
      progress,
      hud,
      error,
      player:
        active === null
          ? "—"
          : active.session.controller
              .getPlayerTransform()
              .position.map((value) => value.toFixed(1))
              .join(", "),
      fps,
      fade,
    });
  const prepare = async (worldId: string): Promise<LoadedWorld> => {
    const cached = loaded.get(worldId);
    if (cached !== undefined) return cached;
    portalStatus = "prefetching-code";
    progress = 0.08;
    error = null;
    emit();
    let pendingAssets: { dispose: () => void } | null = null;
    try {
      const module = await loadRegisteredWorld(worldId);
      portalStatus = "preloading-assets";
      emit();
      const abort = new AbortController();
      const assets = await module.preload({
        signal: abort.signal,
        reportProgress: (report: WorldPreloadProgress) => {
          progress = 0.1 + report.progress * 0.55;
          portalStatus =
            report.stage === "complete" ? "initializing-world" : "preloading-assets";
          emit();
        },
      });
      pendingAssets = assets;
      portalStatus = "initializing-world";
      progress = 0.75;
      emit();
      let worldHud: ReactNode | null = null;
      const session = await module.create({
        registerPortal: (definition) => {
          portals.set(`${module.manifest.id}:${definition.id}`, definition);
          emit();
          return () => portals.delete(`${module.manifest.id}:${definition.id}`);
        },
        requestTravel: travel,
        reportScore: (score) => console.info("World score", module.manifest.id, score),
        setLocalHud: (next) => {
          worldHud = next;
          const existing = loaded.get(module.manifest.id);
          if (existing !== undefined) existing.hud = next;
          if (activeWorldId === module.manifest.id && active !== null) {
            hud = next;
            emit();
          }
        },
        logEvent: (event) => console.info("World event", module.manifest.id, event),
        environment: { input, quality },
      });
      session.controller.disable();
      const result = {
        module,
        session,
        assets,
        lastUsed: performance.now(),
        hud: worldHud,
      };
      loaded.set(worldId, result);
      pendingAssets = null;
      portalStatus = "preview-ready";
      progress = 1;
      emit();
      return result;
    } catch (caught) {
      pendingAssets?.dispose();
      const message =
        caught instanceof Error ? caught.message : "Unknown world loading error";
      error = message;
      portalStatus = "failed";
      progress = 0;
      emit();
      throw new Error(`Could not prepare ${worldId}: ${message}`, { cause: caught });
    }
  };
  async function travel(request: PortalTravelRequest): Promise<void> {
    if (disposed || active === null || request.sourceWorldId !== activeWorldId) return;
    const source = active;
    try {
      const destination = await prepare(request.destinationWorldId);
      portalStatus = "crossing";
      fade = true;
      emit();
      await new Promise<void>((resolve) =>
        setTimeout(resolve, quality().reducedMotion ? 0 : 180),
      );
      const saved = await saveService.load();
      saved.worldStates[activeWorldId] = source.session.serialize();
      saved.currentWorldId = request.destinationWorldId;
      saved.currentEntryPointId = request.destinationEntryPointId;
      if (!saved.worldsVisited.includes(request.destinationWorldId))
        saved.worldsVisited.push(request.destinationWorldId);
      try {
        await saveService.save(saved);
      } catch (saveError) {
        console.error("Travel continued after local save failure", saveError);
      }
      source.session.controller.disable();
      await source.session.exit({
        reason: "portal",
        destinationWorldId: request.destinationWorldId,
      });
      source.lastUsed = performance.now();
      setTimeout(() => {
        if (
          !disposed &&
          active !== source &&
          performance.now() - source.lastUsed >= 29_000
        ) {
          source.session.dispose();
          source.assets.dispose();
          loaded.delete(source.module.manifest.id);
          emit();
        }
      }, 30_000);
      active = destination;
      activeWorldId = request.destinationWorldId;
      hud = destination.hud;
      const restoredState = saved.worldStates[activeWorldId];
      destination.session.controller.setPlayerTransform(
        destination.module.entryPoints.find(
          (entry) => entry.id === request.destinationEntryPointId,
        )?.transform ??
          destination.module.entryPoints[0]?.transform ??
          request.playerTransform,
      );
      await destination.session.enter({
        entryPointId: request.destinationEntryPointId,
        previousWorldId: request.sourceWorldId,
        ...(restoredState === undefined ? {} : { restoredState }),
      });
      destination.session.controller.enable();
      destination.lastUsed = performance.now();
      portalStatus = "active";
      fade = false;
      emit();
      setTimeout(() => {
        if (!disposed && portalStatus === "active") {
          portalStatus = "cooling-down";
          emit();
          setTimeout(() => {
            if (!disposed && portalStatus === "cooling-down") {
              portalStatus = "dormant";
              emit();
            }
          }, 500);
        }
      }, 350);
    } catch (caught) {
      fade = false;
      error = caught instanceof Error ? caught.message : "Travel failed";
      portalStatus = "failed";
      source.session.controller.enable();
      active = source;
      activeWorldId = source.module.manifest.id;
      emit();
      throw caught;
    }
  }
  const start = async () => {
    const save = await saveService.load();
    if (save.currentWorldId === "" || !isWorldRegistered(save.currentWorldId)) {
      activeWorldId = "none";
      portalStatus = "dormant";
      progress = 1;
      emit();
      return;
    }
    activeWorldId = save.currentWorldId;
    const initial = await prepare(activeWorldId);
    active = initial;
    const restoredState = save.worldStates[activeWorldId];
    await initial.session.enter({
      entryPointId: save.currentEntryPointId,
      ...(restoredState === undefined ? {} : { restoredState }),
    });
    initial.session.controller.enable();
    hud = initial.hud;
    portalStatus = "active";
    emit();
  };
  const update = (delta: number) => {
    elapsed += delta;
    frames += 1;
    if (elapsed - lastFpsAt >= 0.5) {
      fps = Math.round(frames / (elapsed - lastFpsAt));
      frames = 0;
      lastFpsAt = elapsed;
      emit();
    }
    if (active === null) return;
    active.session.update({
      deltaSeconds: Math.min(delta, 0.05),
      elapsedSeconds: elapsed,
    });
    const player = active.session.controller.getPlayerTransform().position;
    for (const portal of portals.values()) {
      if (portal.destinationWorldId === activeWorldId) continue;
      const distance = Math.hypot(
        player[0] - portal.transform.position[0],
        player[1] - portal.transform.position[1],
        player[2] - portal.transform.position[2],
      );
      if (
        distance < portal.preloadRadius &&
        !loaded.has(portal.destinationWorldId) &&
        portalStatus !== "prefetching-code" &&
        portalStatus !== "preloading-assets" &&
        portalStatus !== "initializing-world"
      )
        void prepare(portal.destinationWorldId).catch((preloadError: unknown) =>
          console.error("Portal preload failed; source remains active", preloadError),
        );
    }
  };
  return {
    start,
    update,
    getSession: () => active?.session ?? null,
    resize: (width: number, height: number, pixelRatio: number) => {
      for (const world of loaded.values())
        world.session.resize(width, height, pixelRatio);
    },
    retry: () => {
      error = null;
      portalStatus = "dormant";
      emit();
    },
    dispose: () => {
      disposed = true;
      for (const world of loaded.values()) {
        world.session.dispose();
        world.assets.dispose();
      }
      loaded.clear();
      portals.clear();
    },
  };
};
