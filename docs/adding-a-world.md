# Owner workflow for adding a world

Modelverse ships with no registered worlds. The project owner designs each world and assigns its implementation to a model. Authoring and platform integration are deliberately separate tasks.

## 1. Create the owner brief

Decide the world concept before starting an implementation chat. Use [the creative-brief template](world-brief-template.md) to specify identity, player experience, mechanic, camera, desktop and touch intent, visual/audio direction, layout, portals, budgets, model discretion, and acceptance criteria.

Use `none` when something is intentionally absent and `none yet` when a portal destination has not been selected. Do not leave a placeholder for the implementation model to fill unless you explicitly want it to make that decision.

## 2. Prepare an isolated package

```bash
pnpm create:world <world-id>
```

Then, before handing it to a model:

- confirm the generated package name, manifest ID, provenance world ID, and brief world ID;
- replace the template title, description, entry point, and remaining placeholders;
- replace `WORLD_BRIEF.md` with the completed owner brief;
- leave the package out of `apps/web/src/registry.ts`;
- create a dedicated branch or worktree when practical.
- run `pnpm install` so the new workspace importer and lockfile are ready for isolated checks.

The scaffolder excludes local `dist` and `node_modules` output and never edits the registry. The resulting package is intentionally unregistered, so creating it cannot change the running platform.

## 3. Start a fresh model chat

Open [the canonical world-author prompt](world-author-prompt.md), replace `<WORLD_ID>`, and paste it into a fresh chat with repository access.

The prompt instructs the model to:

- treat `WORLD_BRIEF.md` as creative source of truth;
- ask rather than invent missing material decisions;
- modify only the assigned world directory;
- use only public platform contracts;
- implement desktop and mobile behavior, saves, failures, cleanup, tests, and provenance;
- leave registry integration to a separate reviewed task.

Do not give the implementation model old planning packs, unrelated world briefs, or permission to edit the platform.

## 4. Review the isolated result

Confirm that:

- the result matches the owner brief without unapproved mechanics, lore, themes, or destinations;
- the package imports only allowed public exports;
- no second renderer or page-based travel exists;
- preload cancellation, save restoration, failures, and repeated disposal are tested;
- desktop and touch controls are documented and usable;
- provenance contains no invented measurements or metadata;
- `SDK_REQUESTS.md` clearly identifies any missing platform capability.

Run:

```bash
pnpm --filter @modelverse/world-<world-id> typecheck
pnpm --filter @modelverse/world-<world-id> test
pnpm --filter @modelverse/world-<world-id> build
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## 5. Integrate in a separate platform task

Only after owner approval:

1. Add the reviewed package as an `apps/web` dependency.
2. Add one static loader to `apps/web/src/registry.ts`.
3. Validate that the registry key and manifest ID match.
4. Add browser tests for load, entry, travel where applicable, save restoration, destination failure, return travel, and cleanup.
5. Test desktop and representative mobile viewports.
6. Update public documentation only with facts about the implemented world.

Example loader:

```ts
export const worldRegistry: WorldRegistry = {
  "example-world": async () => (await import("@modelverse/world-example-world")).default,
};
```

The registry remains local and explicit. Modelverse does not discover or execute arbitrary remote world code.

## 6. Freeze the SDK later

Do not freeze SDK 1.0 after one package merely compiles. Independent worlds must first prove different owner briefs, controls, cameras, desktop and touch behavior, portal travel, state restoration, failure recovery, and complete resource cleanup.
