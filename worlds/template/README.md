# World package template

This is an unregistered, contract-complete scaffold. It contains no gameplay and is not part of the running Modelverse catalog.

## Prepare an assignment

1. From the repository root, run `pnpm create:world <world-id>`.
2. Confirm the generated identifiers and replace the remaining template metadata.
3. The project owner completes `WORLD_BRIEF.md`; implementation models do not fill creative placeholders.
4. Run `pnpm install` so the new workspace and lockfile are ready.
5. Copy the canonical assignment from `docs/world-author-prompt.md` into the fresh model chat and into `PROMPT.md`.
6. Keep the package unregistered until isolated implementation and review are complete.

Read [the authoring guide](../../docs/adding-a-world.md) for the owner workflow and [the SDK contract](../../docs/world-sdk.md) for lifecycle rules.

## Template checks

```bash
pnpm --filter @modelverse/world-template typecheck
pnpm --filter @modelverse/world-template test
pnpm --filter @modelverse/world-template build
```

The included test is deliberately generic so a copied world starts with manifest, preload, provenance, lifecycle, restoration, and idempotent-disposal coverage that its author must strengthen.
