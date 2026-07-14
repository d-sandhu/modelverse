# Modelverse agent instructions

## Repository purpose

This repository is the Modelverse platform foundation. It intentionally contains no registered or product worlds.

The project owner designs every world. A coding model implements only the world described in the owner's completed creative brief. Do not invent a world concept, theme, mechanic, objective, story, art direction, or portal destination unless the owner explicitly asks for ideation.

## Before making changes

- Platform work: read `README.md`, `docs/product.md`, `docs/architecture.md`, and the relevant package source.
- World work: read `docs/world-author-prompt.md`, the assigned `WORLD_BRIEF.md`, `docs/world-sdk.md`, `docs/portal-system.md`, `docs/mobile-performance.md`, `docs/provenance.md`, and `worlds/template/README.md`.
- If a world brief still contains placeholders or omits a decision that materially changes the world, stop and ask the owner. Do not fill creative gaps by assumption.

## Scope boundaries

- A world-authoring task may create or modify only its assigned `worlds/<world-id>/` directory.
- World authors must not edit the registry, applications, platform packages, infrastructure, or other worlds.
- Platform integration is a separate reviewed task after the world package passes compatibility checks.
- Worlds may import public package exports only. They must never import private engine files or create another application renderer.
- Basic gameplay must remain local-first and must not require the API or live model calls.

## Coding rules

- TypeScript strict mode
- `type` aliases instead of `interface`
- No explicit `any`
- No `@ts-ignore`
- No swallowed errors
- Explicit lifecycle cleanup for listeners, timers, Three.js resources, audio, physics, and render targets
- Desktop and mobile input from the public input service
- Versioned save data and honest provenance; unknown values remain unknown

## Verification

Run the checks appropriate to the change, then finish with:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Run `pnpm test:e2e` for platform integration or browser-shell changes. An unregistered world package should be tested through its package compatibility and lifecycle tests before integration.
