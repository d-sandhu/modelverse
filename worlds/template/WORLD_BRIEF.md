# World creative brief

Status: **INCOMPLETE TEMPLATE — THE PROJECT OWNER MUST REPLACE ALL PLACEHOLDERS BEFORE IMPLEMENTATION.**

Use `docs/world-brief-template.md` as the authoritative field guide.

## Identity

- World ID: `<required>`
- Title: `<required>`
- One-sentence premise: `<required>`

## Player experience

- Player embodiment: `<required>`
- Primary mechanic: `<required>`
- Core loop: `<required>`
- Objective or endpoint: `<required or none>`
- Intended session length: `<required>`

## Controls and camera

- Camera behavior: `<required>`
- Desktop control intent: `<required>`
- Mobile control intent: `<required>`
- Optional gamepad behavior: `<required or none>`

## World direction

- Environment/theme: `<required>`
- Shape language: `<required>`
- Color and lighting direction: `<required>`
- Motion style: `<required>`
- Audio direction: `<required or none>`
- HUD direction: `<required>`
- Narrative/lore constraints: `<required or none>`
- Explicit exclusions: `<required or none>`

## Layout

- Starting area: `<required>`
- Landmarks: `<required or explicitly delegated>`
- Exploration boundaries: `<required>`

## Portals and entry points

Physical portals are a standard Modelverse primitive. The world declares owner-approved placement, presentation, and destinations; the platform owns cross-world travel. Use `none yet` rather than inventing an unselected destination.

- Entry points: `<required>`
- Portal placement and presentation: `<required or none yet>`
- Outbound portals: `<owner-approved destinations or none yet>`
- Arrival constraints: `<required>`

## Technical budgets

- SDK version: `<required>`
- Asset budget: `<required>`
- Compressed JavaScript target: `<required>`
- Desktop target: `<required>`
- Mobile target: `<required>`
- Quality-level simplifications: `<required>`
- Physics: `<required: none, custom, or Rapier>`

## Model discretion

The model may decide: `<explicit list>`

The model must ask before changing: `<explicit list>`

## Acceptance criteria

- `<owner-defined criterion>`
- Desktop and mobile controls work.
- Save, restoration, failure handling, and cleanup are tested.
- Provenance contains no invented information.
