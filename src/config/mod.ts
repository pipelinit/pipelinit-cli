import { fileExists, parseToml, stringifyToml } from "../../deps.ts";
import { JavaScriptProject, PythonProject } from "../../plugins/stack/mod.ts";
import { arePlatforms, Platforms } from "../platform/mod.ts";

export const CONFIG_FILE = ".pipelinit.toml";
export type Config = {
  platforms?: Platforms;
  plugins?: {
    javascript?: Partial<JavaScriptProject>;
    python?: Partial<PythonProject>;
  };
  exists: () => Promise<boolean>;
  load: () => Promise<void>;
  save: () => Promise<void>;
};

function isConfig(c: Record<string, unknown>): c is Config {
  const platforms = c?.platforms;
  if (
    typeof platforms === "object" &&
    platforms !== null &&
    platforms instanceof Array
  ) {
    return arePlatforms(platforms);
  }
  return false;
}

export let config: Config = {
  exists: async () => await fileExists(CONFIG_FILE),
  save: async () => {
    await Deno.writeTextFile(CONFIG_FILE, stringifyToml(config));
  },
  load: async () => {
    const configContent = parseToml(await Deno.readTextFile(CONFIG_FILE));
    // FIXME this validation is weak
    if (isConfig(configContent)) {
      config = { ...config, ...configContent };
    }
    throw new Error("Couldn't parse configuration file");
  },
};
