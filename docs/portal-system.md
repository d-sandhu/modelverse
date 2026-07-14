# Portal lifecycle contract

Portals are platform-managed connections declared by worlds. A world places and registers a portal; it never implements cross-world loading or page navigation itself.

## States

```text
dormant
  -> prefetching-code
  -> preloading-assets
  -> initializing-world
  -> preview-ready
  -> crossing
  -> active
  -> cooling-down
  -> dormant
```

Loading, preload, initialization, preview, or travel errors transition to `failed`. A retry may return to prefetching. Invalid transitions are rejected.

## Expected lifecycle

1. The active world registers a portal from the owner's brief.
2. When the player enters its preload radius, the shell imports the explicitly registered destination bundle.
3. The shell validates the destination manifest and reports preload progress.
4. Destination assets and session initialize with its controller disabled.
5. The source world remains playable throughout preparation.
6. Travel is allowed only after the destination is ready and crossing criteria are satisfied.
7. The shell serializes and exits the source, maps the player to the destination entry point, enters the destination, then activates its controller, camera, HUD, and audio.
8. The source may remain cached briefly and is later disposed according to platform policy.

## Preview behavior

High-quality devices may eventually render a destination scene to a reduced-resolution render target at a reduced frame rate. Medium and low quality use static or shader fallbacks. Rendering two worlds is optional and never required for travel.

## Failure behavior

- A destination import, validation, preload, or initialization failure must not crash or disable the source world.
- Partially allocated destination assets must be disposed.
- The player receives a concise recoverable error.
- Preview failure does not block a ready destination.
- A destination identifier must come from the owner's brief and the reviewed local registry; authors must not invent or remotely fetch one.

## Author responsibilities

- Register only portals specified in `WORLD_BRIEF.md`.
- Leave adequate space around each portal plane and destination entry point.
- Keep important geometry from trapping the arriving player.
- Document any portal-specific visual or performance costs.
- Do not edit the platform state machine from a world-authoring task.
