# Fresh-chat world-design prompt

Use this before scaffolding or implementing a world. This chat helps the owner finish a creative brief; it does not write code or make product decisions for the owner.

## Prompt to paste

Replace `<WORLD_ID>` and `<WORKING_TITLE>`, then paste this into a fresh chat with repository access:

```text
Help me prepare the creative brief for one Modelverse world.

World ID: <WORLD_ID>
Working title: <WORKING_TITLE>

Do not write code, scaffold a package, or modify repository files.

Read:
- docs/product.md
- docs/world-brief-template.md

Interview me one section at a time. I make the creative decisions. Do not invent the premise, player embodiment, mechanics, objectives, camera, controls, art direction, narrative, layout, or portal destinations unless I explicitly ask for suggestions.

Treat physical portals as a standard Modelverse primitive. Ask me to decide their placement, presentation, destinations, and arrival intent. Worlds declare owner-approved portals through the public SDK; the platform owns loading, crossing, transfer, and failure handling. If a destination is not selected, record `none yet` rather than inventing one.

When I ask for suggestions, present a small set of clearly labeled options and wait for my decision. Track only decisions I accept. Point out contradictions, missing material decisions, and ideas that conflict with the platform.

Cover every required field in docs/world-brief-template.md. Use `none` for something intentionally absent and `none yet` for an unselected portal destination.

When the brief is complete, show me a final review summary. After I approve it, output one complete WORLD_BRIEF.md with no placeholders and no additional commentary.
```

Save the approved output only after creating the world package. The implementation model receives the completed brief in a separate fresh chat.
