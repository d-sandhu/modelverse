import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";

const worldIdPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const updateJsonString = async (
  filePath: string,
  field: string,
  value: string,
): Promise<void> => {
  const parsed: unknown = JSON.parse(await readFile(filePath, "utf8"));
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new Error(`${filePath} must contain a JSON object`);
  }
  const record = parsed as Record<string, unknown>;
  if (!(field in record)) throw new Error(`${filePath} is missing ${field}`);
  record[field] = value;
  await writeFile(filePath, `${JSON.stringify(record, null, 2)}\n`, "utf8");
};

const replaceRequiredText = async (
  filePath: string,
  expected: string,
  replacement: string,
): Promise<void> => {
  const source = await readFile(filePath, "utf8");
  if (!source.includes(expected)) {
    throw new Error(`${filePath} does not contain the expected template marker`);
  }
  await writeFile(filePath, source.replace(expected, replacement), "utf8");
};

export const createWorldScaffold = async (
  worldId: string,
  templateRoot: string,
  worldsRoot: string,
): Promise<string> => {
  if (!worldIdPattern.test(worldId) || worldId === "template") {
    throw new Error(
      "World ID must be a non-template kebab-case identifier using lowercase letters and numbers.",
    );
  }

  const targetRoot = join(worldsRoot, worldId);
  await mkdir(worldsRoot, { recursive: true });
  await cp(templateRoot, targetRoot, {
    recursive: true,
    errorOnExist: true,
    force: false,
    filter: (source) => {
      const name = basename(source);
      return name !== "dist" && name !== "node_modules";
    },
  });

  await updateJsonString(
    join(targetRoot, "package.json"),
    "name",
    `@modelverse/world-${worldId}`,
  );
  await updateJsonString(join(targetRoot, "world.provenance.json"), "worldId", worldId);
  await replaceRequiredText(
    join(targetRoot, "src/index.ts"),
    'id: "template"',
    `id: "${worldId}"`,
  );
  await replaceRequiredText(
    join(targetRoot, "WORLD_BRIEF.md"),
    "- World ID: `<required>`",
    `- World ID: \`${worldId}\``,
  );

  return targetRoot;
};
