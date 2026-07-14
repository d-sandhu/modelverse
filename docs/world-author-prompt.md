# Canonical fresh-chat world-author prompt

## How the project owner uses this

1. Run `pnpm create:world <world-id>`.
2. Fill in that package's `WORLD_BRIEF.md` using `docs/world-brief-template.md`.
3. Run `pnpm install` to update workspace links and the lockfile.
4. Start a fresh coding-model chat with repository access.
5. Paste the prompt below without adding unrelated world ideas.

The world package remains unregistered while the authoring model works. Registry integration happens separately after review.

---

## Prompt to paste into a fresh chat

You are implementing exactly one owner-designed world inside the Modelverse platform.

The project owner has already made the creative decisions. Your job is to implement the assigned `WORLD_BRIEF.md` faithfully, not to invent or replace the world concept.

### Assignment

- Assigned directory: `worlds/<WORLD_ID>/`
- Creative source of truth: `worlds/<WORLD_ID>/WORLD_BRIEF.md`
- Platform SDK status: pre-1.0 and not frozen

Replace `<WORLD_ID>` in this prompt with the assigned directory name before starting.

### Mandatory preflight

Read these files completely before coding:

```text
AGENTS.md
docs/product.md
docs/architecture.md
docs/world-sdk.md
docs/portal-system.md
docs/mobile-performance.md
docs/provenance.md
docs/adding-a-world.md
worlds/<WORLD_ID>/WORLD_BRIEF.md
worlds/<WORLD_ID>/README.md
packages/world-sdk/src/index.ts
packages/testing/src/index.ts
```

Inspect the assigned package and relevant public package exports. Source code is authoritative if documentation and types disagree.

Then report:

1. your understanding of the owner's world brief;
2. the lifecycle and package boundaries you must follow;
3. any missing required decision or unresolved placeholder;
4. a small phase-by-phase implementation plan.

Do not code until this preflight is complete.

### Missing information rule

If `WORLD_BRIEF.md` contains a placeholder, contradictory requirement, or a missing decision that materially affects theme, mechanic, objective, camera, controls, art direction, narrative, layout, or portal destination, stop and ask the owner.

Do not silently invent creative direction. You may make ordinary local engineering decisions that preserve the brief. Use only the discretion explicitly granted in its `Model discretion` section.

If the brief says `none` or `none yet`, respect it. In particular, do not create a portal to an unapproved destination.

### Allowed scope

You may create and modify only:

```text
worlds/<WORLD_ID>/
```

You may read the entire repository when necessary to understand public contracts.

You must not modify:

```text
apps/
packages/
infra/
other worlds/
apps/web/src/registry.ts
root configuration
```

If the SDK lacks a required capability, document the request in `worlds/<WORLD_ID>/SDK_REQUESTS.md`. Do not work around the SDK by importing private platform modules.

### Platform contract

The platform owns:

- the one application canvas and WebGL renderer;
- render scheduling and resize/orientation handling;
- raw global input listeners and reserved actions;
- world loading, manifest validation, and lifecycle orchestration;
- portal state, travel, failure containment, caching, and unload policy;
- global settings, quality, mute, pause, loading, saves, and API access.

Your world owns:

- its Three.js scene and camera;
- interpretation of public raw input;
- player movement, physics, mechanics, environment, and objectives;
- world-local HUD and audio content;
- owner-approved entry points and portals;
- versioned local save data and migrations;
- disposal of everything it allocates.

### Required implementation behavior

The completed package must:

1. Export one valid `WorldModule` whose manifest ID matches the package and directory.
2. Declare a valid default entry point and every owner-approved entry point.
3. Implement cancellable preload with honest visible progress.
4. Create its own scene, camera, controller, lifecycle, serializer, and disposer without creating a renderer.
5. Use controls and camera behavior from the brief.
6. Be playable with desktop input and mobile touch input unless the owner explicitly narrows support.
7. Respect safe areas, reduced motion, global quality, and mute behavior exposed by the SDK.
8. Register only owner-approved portals and request travel through the SDK.
9. Keep basic play functional when the API is unavailable.
10. Use versioned world save data, restore it, and handle incompatible/corrupt state deliberately.
11. Dispose geometries, materials, textures, render targets, audio, physics, listeners, timers, subscriptions, and temporary resources.
12. Include compatibility, lifecycle, restoration, failure, and idempotent-cleanup tests.
13. Maintain all required provenance and world documentation files.

### Coding rules

- TypeScript strict mode
- `type` aliases, never `interface`
- No explicit `any`
- No `@ts-ignore`
- No swallowed errors
- No arbitrary remote JavaScript
- No page navigation for travel
- No permanent unmanaged global listeners
- No live model calls during gameplay
- No multiplayer or platform expansion unless the brief explicitly requests it and the SDK supports it
- No edits to another world
- No invented provenance, performance numbers, token counts, hours, costs, dates, screenshots, or commit ranges

### Mobile and performance

Mobile support is part of the implementation, not a later polish pass. Use world-appropriate touch controls rather than forcing a universal layout. Keep required actions large, safe-area-aware, readable, and usable without hover.

Start conservatively, avoid allocations in the frame loop, pool repeated temporary objects, instance repeated geometry where useful, limit expensive shadows and post-processing, and implement the brief's low-quality simplifications. Record only measured performance as measured; label estimates explicitly.

### Provenance files

Maintain:

```text
WORLD_BRIEF.md
PROMPT.md
PROMPT_LOG.md
INTERVENTIONS.md
CHANGELOG.md
CONTROLS.md
PERFORMANCE.md
ART_DIRECTION.md
SDK_REQUESTS.md
world.provenance.json
screenshots/
```

Copy this exact assignment into `PROMPT.md`. Log meaningful follow-up owner instructions in `PROMPT_LOG.md`. Record human guidance or code edits in `INTERVENTIONS.md`. Leave unknown provenance fields as `null` or empty according to the schema.

### Working method

Work in small vertical slices:

1. Validate the brief, manifest, package, entry points, and empty lifecycle.
2. Gray-box the owner-specified movement, camera, desktop input, and touch input.
3. Implement the primary mechanic and save/restore behavior.
4. Add only the owner-approved environment, HUD, audio, objectives, entry points, and portals.
5. Add failure handling and complete cleanup.
6. Add tests and measure performance where the environment permits.
7. Update provenance and documentation.

Keep the repository runnable. Fix root causes rather than suppressing errors. Do not polish visuals before lifecycle, mobile input, save/restore, failure handling, and cleanup are correct.

### Verification

At minimum run:

```bash
pnpm --filter @modelverse/world-<WORLD_ID> typecheck
pnpm --filter @modelverse/world-<WORLD_ID> build
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Do not edit the platform registry merely to run the world. If visual browser testing requires temporary integration, stop and ask the owner for a separate integration step rather than changing files outside your scope.

### Completion report

Report:

- how the implementation maps to the owner's brief;
- controls and mobile behavior;
- camera, movement, and primary mechanic;
- save and restoration behavior;
- resource cleanup and failure handling;
- files changed;
- tests and exact results;
- measured or estimated performance with labels;
- provenance status;
- known limitations;
- SDK requests;
- any creative decision that required owner confirmation.

Do not claim the world is integrated, published, or production-ready while it remains unregistered.

---

## Separate integration prompt

After the owner approves an authored world, use a new platform-integration chat. That task may add the reviewed package dependency and one static registry loader, then add browser journeys for loading, travel, restoration, failure recovery, and cleanup. Do not give registry authority to the isolated world-authoring model.
