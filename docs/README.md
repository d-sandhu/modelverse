# Modelverse documentation

## Product and platform

- `product.md` — product principles, owner-directed creativity, current status, and non-goals
- `architecture.md` — platform/world ownership, package boundaries, rendering, state, and deployment
- `world-sdk.md` — current public world contract and lifecycle
- `portal-system.md` — portal states, transfer responsibilities, previews, and failures
- `mobile-performance.md` — input, responsive UI, quality behavior, and measurement status
- `provenance.md` — required evidence and unknown-data rules
- `adr/` — accepted architectural decisions

## Creating a world

Use this order:

1. `adding-a-world.md` — concise end-to-end owner workflow.
2. `world-design-prompt.md` — fresh-chat interview that produces the owner brief without coding.
3. `world-brief-template.md` — required creative and technical decisions.
4. `world-author-prompt.md` — separate fresh-chat implementation assignment.
5. `worlds/template/` — unregistered copy-only package scaffold.

The owner chooses the worlds. Implementation models must not invent concepts or register themselves.

## Operations

- `testing.md` — automated and manual foundation verification
- `deployment.md` — production Compose and migration workflow
- `roadmap.md` — current sequencing and SDK-freeze criteria
- `case-study-outline.md` — public portfolio narrative outline

## Authority

Checked-in TypeScript source and schemas are authoritative for exact types and behavior. Documentation explains intent and workflow. If they disagree, stop, report the mismatch, and update both in the appropriate reviewed task rather than guessing.
