# World package template

This is an unregistered, contract-complete scaffold. It contains no gameplay and is not part of the running Modelverse catalog.

## Prepare an assignment

1. Complete the owner brief in a separate chat using `docs/world-design-prompt.md`.
2. From the repository root, run `pnpm create:world <world-id>`.
3. Replace `WORLD_BRIEF.md` with the approved brief and confirm every generated ID.
4. Run `pnpm install` and commit the assignment baseline.
5. Copy `docs/world-author-prompt.md` into a separate fresh implementation chat and `PROMPT.md`.
6. Keep the package unregistered until isolated implementation and review are complete.

Read [the authoring guide](../../docs/adding-a-world.md) for the owner workflow and [the SDK contract](../../docs/world-sdk.md) for lifecycle rules.

## Template checks

```bash
pnpm --filter @modelverse/world-template typecheck
pnpm --filter @modelverse/world-template test
pnpm --filter @modelverse/world-template build
```

The included test is deliberately generic so a copied world starts with manifest, preload, provenance, lifecycle, restoration, and idempotent-disposal coverage that its author must strengthen.
