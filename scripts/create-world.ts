import { join } from "node:path";
import { createWorldScaffold } from "./world-scaffold.js";

const worldId = process.argv[2];
if (worldId === undefined) {
  console.error("Usage: pnpm create:world <kebab-case-world-id>");
  process.exitCode = 1;
} else {
  try {
    const target = await createWorldScaffold(
      worldId,
      join(process.cwd(), "worlds/template"),
      join(process.cwd(), "worlds"),
    );
    console.info(`Created unregistered world scaffold at ${target}`);
    console.info("Next: complete WORLD_BRIEF.md and run pnpm install before the chat.");
  } catch (error) {
    console.error(error instanceof Error ? error.message : "World scaffolding failed");
    process.exitCode = 1;
  }
}
