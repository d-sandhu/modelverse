# Testing the Modelverse foundation

This guide verifies the platform without relying on any authored world.

## 1. Install

```bash
cp .env.example .env
pnpm install
pnpm --filter @modelverse/web exec playwright install chromium
```

The Playwright browser installation is needed once per machine.

## 2. Run automated checks

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e
pnpm format:check
```

These checks prove:

- strict TypeScript and package boundaries compile;
- manifest, portal geometry, quality, persistence, provenance, and API behavior pass unit tests;
- the web production bundle builds;
- the shell boots at desktop and mobile viewports with no registered worlds;
- the shared WebGL canvas is visible;
- global mute/debug controls and manual quality selection work;
- API unavailability does not prevent the shell from starting.

## 3. Manual browser smoke test

Start both applications:

```bash
pnpm dev
```

Open `http://localhost:5173` and check:

1. A cyan wireframe cube and grid are visible. They are an engine diagnostic, not a world.
2. The status card says `Platform shell ready` and `No worlds are registered`.
3. Click **Debug**. It should report `Active world: none`, `Loaded: none`, `Portal: dormant`, an approximate FPS, quality, input mode, and optional API status.
4. Change the graphics selector. The debug quality value should change.
5. Press `M`. The Mute button should change to Unmute. Press backtick to toggle Debug.
6. Resize the browser and test a narrow/mobile viewport. The canvas and status card should remain usable; portrait phones receive an orientation suggestion.

Open the browser console. There should be no uncaught application error. An informational message that the optional API is offline is expected when the API is not running.

## 4. API smoke test

With `pnpm dev` running:

```bash
curl http://localhost:3001/health
```

Expected body:

```json
{ "status": "ok", "service": "modelverse-api" }
```

The health route does not require PostgreSQL. Database-backed routes return a controlled error if PostgreSQL is unavailable.

## 5. PostgreSQL migration test

Set `DATABASE_URL` to an empty PostgreSQL database, then run:

```bash
pnpm --filter @modelverse/api prisma:generate
pnpm --filter @modelverse/api prisma:migrate
```

Expected result: Prisma reports that `0001_initial` was applied. Never point this check at an unreviewed production database.

Alternatively, configure `POSTGRES_PASSWORD` and `PUBLIC_ORIGIN` and use:

```bash
docker compose -f infra/compose.production.yml up --build
```

## 6. Test a future world without changing the platform baseline

The project owner first completes a creative brief, then copies `worlds/template` into an isolated branch or agent workspace. The implementation model runs package compatibility tests while the world remains unregistered. Registry and browser-journey testing happen later in a separate reviewed platform task. Full instructions are in [the owner workflow](adding-a-world.md).

## Troubleshooting

- `Executable doesn't exist` from Playwright: run the Chromium installation command from step 1.
- API reports database unavailable: start PostgreSQL or verify `DATABASE_URL`; the browser smoke harness should still work.
- Blank canvas: check WebGL availability and the browser console, then try Low quality.
- Stale world ID in IndexedDB: the empty registry safely falls back to `Active world: none`. Clear site data if you want a completely fresh save.
