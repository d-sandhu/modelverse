# World provenance

Provenance records how an owner-designed world was implemented. It is evidence, not marketing copy, and must remain honest when information is unavailable.

## Required files

Each authored world keeps:

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

`WORLD_BRIEF.md` contains owner decisions. `PROMPT.md` contains the exact implementation assignment. Follow-up guidance goes in `PROMPT_LOG.md`, while human guidance and direct edits go in `INTERVENTIONS.md`.

## Structured metadata

`packages/provenance` validates:

- schema and world ID;
- model and tool, when known;
- skills used;
- start and completion dates, when known;
- prompt and agent-run counts, when known;
- human time and intervention count, when known;
- token usage and estimated cost, when known;
- commit range and screenshots, when known;
- performance measurements.

Numeric effort, token, cost, and performance values carry a `measured` or `estimated` basis where required. Unknown values remain `null` or empty according to the schema. Do not infer hidden token usage, cost, human time, model versions, dates, or commits.

## Evidence quality

Prefer committed prompts, Git history, reproducible test output, build artifacts, and device-specific measurements. Screenshots must exist before being listed. Performance entries should name the device, metric, value, unit, quality level where relevant, and whether the value was measured or estimated.

The unregistered template contains valid empty provenance scaffolding. A world author replaces it with factual data during implementation.
