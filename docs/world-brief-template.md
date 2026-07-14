# World creative brief

This file is completed by the project owner before a model implements the world. Replace every required placeholder. Use `none` when a feature is intentionally absent. Do not leave creative decisions for the implementation model unless that freedom is explicit.

## Identity

- World ID: `<kebab-case-id>`
- Title: `<display title>`
- One-sentence premise: `<owner-provided premise>`

## Player experience

- Player embodiment: `<what the player is>`
- Primary mechanic: `<main interaction>`
- Core loop: `<what the player repeatedly does>`
- Objective or endpoint: `<goal, discovery, score, or none>`
- Intended session length: `<range>`

## Controls and camera

- Camera behavior: `<owner direction>`
- Desktop control intent: `<bindings or desired behavior>`
- Mobile control intent: `<touch behavior>`
- Optional gamepad behavior: `<behavior or none>`

## World direction

- Environment/theme: `<owner direction>`
- Shape language: `<owner direction>`
- Color and lighting direction: `<owner direction>`
- Motion style: `<owner direction>`
- Audio direction: `<owner direction or none>`
- HUD direction: `<owner direction>`
- Narrative/lore constraints: `<constraints or none>`
- Explicit exclusions: `<things the model must not add>`

## Layout

- Starting area: `<description>`
- Landmarks: `<owner-specified landmarks or freedom explicitly granted>`
- Exploration boundaries: `<size/shape expectations>`

## Portals and entry points

List only owner-approved connections. Use `none yet` when destinations have not been chosen; the model must not invent them.

- Entry points: `<IDs and intent>`
- Outbound portals: `<portal ID, destination world ID, destination entry ID, intent>`
- Arrival constraints: `<clearance, facing, staging>`

## Technical budgets

- SDK version: `<current approved version>`
- Asset budget: `<bytes/MB>`
- Compressed JavaScript target: `<target>`
- Desktop target: `<FPS/device class>`
- Mobile target: `<FPS/device class>`
- Quality-level simplifications: `<required behavior>`
- Physics: `<none, custom, or Rapier>`

## Model discretion

The model may decide: `<explicit list of local implementation or creative decisions>`

The model must ask before changing: `<explicit list>`

## Acceptance criteria

- `<owner-defined outcome 1>`
- `<owner-defined outcome 2>`
- Desktop and mobile controls work.
- Save, restoration, failure handling, and cleanup are tested.
- Provenance contains no invented measurements or metadata.
