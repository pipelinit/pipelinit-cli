import { expandGlob } from "../../deps.ts";
import { PIPELINIT_ROOT } from "../../pipelinit.ts";
import { ConcretePlatform, Platform } from "../../plugins/mod.ts";

export const loadPlugins = async (): Promise<Array<Platform>> => {
  const plugins: Array<Platform> = [];
  // Load the platform plugins ignoring test files (ending in .test.ts)
  for await (
    const pluginFile of expandGlob("plugins/platforms/*[!.test].ts", {
      root: PIPELINIT_ROOT,
    })
  ) {
    const pluginModule: ConcretePlatform =
      (await import(pluginFile.path)).default;
    plugins.push(new pluginModule());
  }
  return plugins;
};
