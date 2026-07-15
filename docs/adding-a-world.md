# Starting a world

Every world begins with an owner-approved brief, then an isolated implementation, then a separate integration review.

## 1. Create the branch

Start from current `main`:

```bash
git switch main
git pull --ff-only
git switch -c world/<world-id>
```

Use a stable kebab-case ID such as `water-world`. The ID becomes the directory, package suffix, and manifest ID.

## 2. Finish the creative brief

Open a fresh chat and use [the world-design prompt](world-design-prompt.md). The chat interviews you and produces a completed `WORLD_BRIEF.md`; it does not code or modify the repository.

You make the creative decisions. Use `none` for an intentionally absent feature and `none yet` for an unselected portal destination.

## 3. Prepare the package

```bash
pnpm create:world <world-id>
pnpm install
```

Replace `worlds/<world-id>/WORLD_BRIEF.md` with the approved brief. Confirm the package, manifest, provenance, entry-point, and brief IDs all match. Keep the world out of `apps/web/src/registry.ts`.

Commit this assignment baseline before implementation:

```bash
git add worlds/<world-id> pnpm-lock.yaml
git commit -m "chore: scaffold <world-id> assignment"
```

## 4. Run the implementation chat

Open a separate fresh coding-model chat with repository access. Paste [the world-author prompt](world-author-prompt.md), replace `<WORLD_ID>`, and let the model complete its required preflight.

The model may edit only `worlds/<world-id>/`. Missing creative decisions go back to the owner. Missing platform capabilities go in `SDK_REQUESTS.md`.

## 5. Review the result

```bash
pnpm --filter @modelverse/world-<world-id> typecheck
pnpm --filter @modelverse/world-<world-id> test
pnpm --filter @modelverse/world-<world-id> build
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Check the brief, desktop and touch controls, save restoration, failure behavior, cleanup, documentation, and provenance. Commit history provides the implementation record; unknown time, token, and cost values remain unknown.

## 6. Integrate separately

After owner approval, merge the unregistered package and create a separate platform-integration task. That task adds the static registry loader and browser tests for loading, travel, restoration, failures, mobile behavior, and cleanup.

Do not freeze SDK 1.0 until multiple independent worlds have proved these contracts.
