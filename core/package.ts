// Script to prepare the core to publish at npm

import { build } from "https://deno.land/x/dnt@0.6.0/mod.ts";
import { walk } from "https://deno.land/std@0.106.0/fs/mod.ts";

await Deno.remove("npm", { recursive: true }).catch((_) => {});

const TEMPLATE_DIR = "./templates";
const TEMPLATE_MOD = `${TEMPLATE_DIR}/mod.ts`;

const isYaml = (path: string) =>
  path.endsWith(".yml") || path.endsWith(".yaml");

async function readTemplates() {
  const bucket: Record<string, string> = {};
  for await (const entry of walk(TEMPLATE_DIR, { includeDirs: false })) {
    if (isYaml(entry.path)) {
      bucket[entry.path] = await Deno.readTextFile(entry.path);
    }
  }
  return bucket;
}

async function embedTemplates(bucket: Record<string, string>) {
  const content = `export const templates = ${JSON.stringify(bucket)}`;
  await Deno.writeTextFile(TEMPLATE_MOD, content);
}

async function clearTemplates() {
  await Deno.writeTextFile(TEMPLATE_MOD, "");
}

async function main() {
  const templates = await readTemplates();
  await embedTemplates(templates);
  await build({
    entryPoints: ["./mod.ts"],
    outDir: "./npm",
    compilerOptions: {
      sourceMap: true,
      target: "ES2021",
    },
    package: {
      // package.json properties
      name: "@pipelinit/core",
      version: Deno.args[0],
      description:
        "Stack detection and CI configuration writing from pipelinit",
      repository: "https://github.com/pipelinit/pipelinit-cli",
      author: "Pipelinit Developers",
      license: "MIT",
      private: false,
      engines: {
        node: "^12.20.0 || ^14.13.1 || >=16.0.0",
      },
    },
  });
  await clearTemplates();
  Deno.copyFileSync("README.md", "npm/README.md");
}

await main();
