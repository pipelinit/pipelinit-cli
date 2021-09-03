// Script to prepare the core to publish at npm
import { walk } from "https://deno.land/std@0.106.0/fs/mod.ts";

const TEMPLATE_DIR = "./templates";
const TEMPLATE_MOD = `${TEMPLATE_DIR}/mod.ts`;

async function readTemplates() {
  const bucket: Record<string, string> = {};
  for await (const entry of walk(TEMPLATE_DIR, { includeDirs: false })) {
    if (entry.path.endsWith(".yaml")) {
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

async function emitTypeScript() {
  const p = Deno.run({
    cmd: [
      "deno",
      "run",
      "--no-check",
      "--unstable",
      "--allow-read",
      "--allow-write=./dist",
      "https://deno.land/x/deno2node@v0.8.0/src/cli.ts",
      "tsconfig.json",
    ],
  });

  const status = await p.status();
  p.close();

  return status.success;
}

async function main() {
  const templates = await readTemplates();
  await embedTemplates(templates);
  await emitTypeScript();
  await clearTemplates();
}
await main();
