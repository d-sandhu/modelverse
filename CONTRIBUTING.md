# Contributing

Use Node 22 and the pinned pnpm version. Keep changes focused, update documentation with contract changes, and run `pnpm lint && pnpm typecheck && pnpm test && pnpm build`.

## Platform changes

Preserve one browser renderer, local-only explicit world imports, local-first basic play, strict package boundaries, and mobile support. Explain architectural changes in an ADR when they alter ownership or public contracts.

## World changes

Do not add an unsolicited world concept. The project owner must provide a completed creative brief before implementation. Follow `docs/adding-a-world.md` and `docs/world-author-prompt.md`.

Worlds may import public packages but never private engine modules. They require desktop and touch controls, versioned saves, provenance, compatibility/lifecycle/failure/cleanup tests, and complete disposal. Registry integration is a separate reviewed platform change.

Do not claim measurements, model metadata, cost, time, screenshots, or performance without evidence.
