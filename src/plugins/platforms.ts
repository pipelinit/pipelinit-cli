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

/**
 * Load available platform plugins, run the detection routine and return
 * detected CI platforms for the current project.
 *
 * @returns an Array with detected CI platforms
 */
export const loadAndDetect = async (): Promise<Array<Platform>> => {
  const plugins: Array<Platform> = await loadPlugins();
  const detected = await Promise.all(plugins.map((p) => p.detect()));
  return plugins.filter((_, i) => detected[i]);
};
