# World SDK 0.1

Status: pre-1.0, implemented, and not frozen.

`@modelverse/world-sdk` is the primary supported boundary between the platform and isolated world packages. The authoritative exported types and schemas are in `packages/world-sdk/src/index.ts`.

## Module contract

Every world exports one `WorldModule` containing:

- a validated manifest and capability list;
- one or more entry points, including the declared default;
- cancellable preload that reports honest progress and returns disposable assets;
- a factory that creates the world session from narrow public capabilities.

The platform validates registry identity and default entry points before activation.

## Session lifecycle

A session owns its scene, camera, controller, local update, resize behavior, serialization, and disposal.

```text
preload -> create -> controller disabled
                    -> enter -> enable -> update
                    -> disable -> exit -> cache or dispose
```

- `enter` receives an entry point, optional previous world, and optional restored versioned state.
- `exit` receives an explicit reason and optional destination.
- `update` receives clamped frame timing from the shell.
- `resize` updates the world camera and world-local size-dependent resources.
- `serialize` returns a versioned opaque record owned by that world.
- `dispose` must be safe to call during normal unload and recovery; authors should make it idempotent.

## Controller contract

The controller can be enabled and disabled independently of session creation. A preloaded destination remains disabled until activation. It exposes player transform get/set operations so the platform can save, debug, and transfer between entry points without accessing world internals.

## Creation capabilities

`WorldCreateContext` exposes only public operations:

- register and unregister an owner-approved portal;
- request platform-managed travel;
- report scores and runtime events;
- set a world-local React HUD;
- read public raw input and a small quality/reduced-motion summary.

Worlds interpret movement and actions independently. The environment does not expose private engine state or another world.

## Input

The shell owns global listeners. `InputService` provides snapshots of keys, pointer buttons and motion, touches, wheel movement, and available gamepads. Worlds may consume pointer delta and request/release pointer lock. Escape, mute, fullscreen, and debug remain reserved platform actions.

## Save ownership

The shell stores `WorldSaveData`; the world owns the meaning of its `value` and future migrations. Schema versions must change deliberately. A world must validate or migrate restored state rather than blindly trusting it.

## Resource ownership

Any world allocation must have a cleanup path, including:

- geometries, materials, textures, render targets, and scene objects;
- audio nodes and decoded buffers;
- physics worlds and bodies;
- listeners, timers, subscriptions, observers, and workers;
- pooled or cached temporary resources.

Preload assets must also be disposed when initialization fails or is aborted.

## Compatibility policy

- Registry keys must equal manifest IDs.
- The default entry point must exist.
- Only reviewed local workspace bundles are loadable.
- Worlds cannot import private platform modules.
- Breaking SDK changes are allowed during `0.x` but require documentation and template updates.
- SDK 1.0 waits for multiple independently implemented owner briefs to prove the real contract.

See [the canonical author prompt](world-author-prompt.md), [portal lifecycle](portal-system.md), and [owner workflow](adding-a-world.md).
