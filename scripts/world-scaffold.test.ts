import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { createWorldScaffold } from "./world-scaffold";

const temporaryRoots: string[] = [];

afterEach(async () => {
  await Promise.all(
    temporaryRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })),
  );
});

describe("world scaffolder", () => {
  it("creates an unregistered clean copy with non-creative identifiers updated", async () => {
    const temporaryRoot = await mkdtemp(join(tmpdir(), "modelverse-world-"));
    temporaryRoots.push(temporaryRoot);

    const target = await createWorldScaffold(
      "owner-world",
      join(process.cwd(), "worlds/template"),
      join(temporaryRoot, "worlds"),
    );

    const packageJson = await readFile(join(target, "package.json"), "utf8");
    const source = await readFile(join(target, "src/index.ts"), "utf8");
    const brief = await readFile(join(target, "WORLD_BRIEF.md"), "utf8");

    expect(packageJson).toContain('"name": "@modelverse/world-owner-world"');
    expect(source).toContain('id: "owner-world"');
    expect(brief).toContain("- World ID: `owner-world`");
    await expect(readFile(join(target, "dist/index.js"), "utf8")).rejects.toThrow();
    await expect(
      readFile(join(target, "node_modules/.modules.yaml"), "utf8"),
    ).rejects.toThrow();
  });

  it("rejects invalid IDs and existing targets", async () => {
    const temporaryRoot = await mkdtemp(join(tmpdir(), "modelverse-world-"));
    temporaryRoots.push(temporaryRoot);
    const worldsRoot = join(temporaryRoot, "worlds");
    const templateRoot = join(process.cwd(), "worlds/template");

    await expect(
      createWorldScaffold("Not Valid", templateRoot, worldsRoot),
    ).rejects.toThrow(/kebab-case/);
    await createWorldScaffold("valid-world", templateRoot, worldsRoot);
    await expect(
      createWorldScaffold("valid-world", templateRoot, worldsRoot),
    ).rejects.toThrow();
  });
});
