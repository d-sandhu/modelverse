# Product direction

## Core idea

Modelverse is one mobile-friendly browser experience containing connected open-world sandboxes. The project owner creates each world's concept and creative brief. Different coding models implement those briefs as isolated packages inside one platform.

Worlds may differ completely in controls, camera, player embodiment, movement, physics, gravity, visuals, audio, interface, objectives, scoring, narrative, and genre.

## Product principles

### Contrast

Crossing between worlds should feel like entering a distinct authored experience, not another level built from a universal controller or visual template.

### Physical continuity

Worlds connect through portals inside the experience. The long-term goal is preloading and crossing without a page reload, with preview quality adapted to the device.

### Owner-directed creativity

The owner decides the world concept, mechanic, theme, and creative constraints. Assigned models implement the brief and may make local technical decisions within it. They do not silently expand or replace the creative direction.

### Verifiable implementation

Each world keeps committed evidence of the assigned model, tool, prompt history, interventions, performance measurements, and build history. Unknown information is never invented.

### Mobile accessibility

Mobile support is part of the first world contract: touch controls, safe-area-aware UI, orientation handling, reduced motion, and device-quality adaptation.

### Public inspectability

The platform, SDK, decisions, prompts, and eventual world histories should be understandable to developers, reviewers, and future agents.

## Explicit non-goals

- Multiplayer
- User-uploaded executable code
- Live model inference during gameplay
- A universal character controller, camera, inventory, or combat system
- One renderer or production container per world
- Kubernetes

## Current status

The repository contains the platform foundation, an empty registry, and an unregistered copy-only world template. No world concept has been selected or committed as part of the product catalog.
