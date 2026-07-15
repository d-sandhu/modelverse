# Modelverse

Modelverse is a mobile-friendly browser platform for independently authored open-world sandboxes connected by portals. The platform owns the renderer, lifecycle, input, quality, saves, and travel rules. Each coding model implements only one owner-designed world.

The repository currently contains the platform foundation and an unregistered world template. It contains no product worlds.

Built with TypeScript, React, Three.js, React Three Fiber, Express, Prisma, PostgreSQL, Vitest, and Playwright.

## Run it

Requirements: Node 22+ and pnpm 11+.

```bash
cp .env.example .env
pnpm install
pnpm dev
```

Open `http://localhost:5173`. A working empty platform shows a wireframe cube, `Platform shell ready`, and `No worlds are registered`. The optional API health route is `http://localhost:3001/health`.

## Check it

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm --filter @modelverse/web exec playwright install chromium # first run only
pnpm test:e2e
pnpm format:check
```

See [Testing](docs/testing.md) for the manual browser and database checks.

## Start a world

1. Create a `world/<world-id>` branch.
2. Use the [world-design prompt](docs/world-design-prompt.md) in a fresh chat to produce the owner-approved brief.
3. Scaffold the unregistered package with `pnpm create:world <world-id>` and add the brief.
4. Use the [world-author prompt](docs/world-author-prompt.md) in a separate fresh implementation chat.
5. Review and test the isolated package before a separate platform integration step.

The complete process is in [Starting a world](docs/adding-a-world.md).

## Documentation

- [Product direction](docs/product.md)
- [Architecture](docs/architecture.md)
- [World SDK](docs/world-sdk.md)
- [Portal system](docs/portal-system.md)
- [Documentation index](docs/README.md)

The SDK is pre-1.0 and will remain unfrozen until independently authored worlds prove its controls, cameras, mobile behavior, travel, restoration, failure recovery, and cleanup contracts.

Modelverse is available under the [MIT License](LICENSE). See [Contributing](CONTRIBUTING.md) and [Security](SECURITY.md).
