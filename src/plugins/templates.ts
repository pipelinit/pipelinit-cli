import { ensureFile, expandGlob } from "../../deps.ts";

export const loadPlugins = async (): Promise<Array<string>> => {
  const plugins: Array<string> = [];
  // Load the template plugins ignoring the test files (ending in .test.ts)
  for await (
    const pluginFile of expandGlob("plugins/templates/**/*[!.test].ts")
  ) {
    plugins.push(pluginFile.path);
  }
  return plugins;
};

export const run = async (pluginUrl: string, platforms: Array<string>) => {
  const pluginModule = await import(pluginUrl);

  const { id, glob, process, platform } = pluginModule.default;

  if (!platforms.includes(platform)) {
    return;
  }

  const result = await process(expandGlob(glob));
  if (result) {
    await ensureFile(`.github/workflows/${id}.yaml`);
    await Deno.writeTextFile(`.github/workflows/${id}.yaml`, result);
    return;
  }
  // TODO: Log progress (no-op plugin)
};
