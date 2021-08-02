import { expandGlob } from "../../deps.ts";
import { PIPELINIT_ROOT } from "../../pipelinit.ts";
import { Template } from "../../plugins/mod.ts";

export const loadPlugins = async (): Promise<Array<Template>> => {
  const plugins: Array<Template> = [];
  // Load the template plugins ignoring the test files (ending in .test.ts)
  for await (
    const pluginFile of expandGlob("plugins/templates/**/!(*.test).ts", {
      root: PIPELINIT_ROOT,
      extended: true,
      globstar: true,
    })
  ) {
    const pluginModule: Template = (await import(pluginFile.path)).default;
    plugins.push(pluginModule);
  }
  return plugins;
};

export const run = async (pluginModule: Template): Promise<string | null> => {
  const { glob, process } = pluginModule;
  return await process(expandGlob(glob));
};
