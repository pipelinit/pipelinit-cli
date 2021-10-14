import {
  Checkbox,
  deepMerge,
  fileExists,
  log,
  parseToml,
  stringifyToml,
} from "../../deps.ts";
import { arePlatforms, isPlatform, Platforms } from "./platform.ts";

export interface StackRegistry {
  docker: string[];
}

const sensibleDefault = `
# Registries to publish artifacts.
# [registries]
# Default values per stack are presented below.
# If your project use other registry(ies), uncomment and edit
# docker = ["registry.hub.docker.com"]
`;

export const CONFIG_FILE = ".pipelinit.toml";
export type Config = {
  platforms?: Platforms;
  registries?: StackRegistry;
  exists: () => Promise<boolean>;
  load: () => Promise<void>;
  save: () => Promise<void>;
};

export function isConfig(c: Record<string, unknown>): c is Config {
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

export const config: Config = {
  exists: async () => await fileExists(CONFIG_FILE),
  save: async () => {
    await Deno.writeTextFile(
      CONFIG_FILE,
      stringifyToml(config) + sensibleDefault,
    );
  },
  load: async () => {
    const configContent = parseToml(await Deno.readTextFile(CONFIG_FILE));
    // FIXME this validation is weak
    if (isConfig(configContent)) {
      const newConfig = deepMerge(config, configContent);
      config.platforms = newConfig.platforms;
      config.registries = newConfig.registries;
    } else {
      throw new Error("Couldn't parse configuration file");
    }
  },
};

// TODO
// The handling of some specific key presses on Windows doesn't
// work correclty in Deno. As a workaround, the checkbox prompt
// uses "u" and "d" to navigate across options. This hint informs
// that to the user. We should remove this hint when the expected
// behavior (up and down arrow keys) are available.
//
// Keep an eye on those issues:
// https://github.com/c4spar/deno-cliffy/issues/272
// https://github.com/denoland/deno/issues/5945
const NAV_HINT = Deno.build.os === "windows"
  ? "Press <space> to select, use 'u' and 'd' keys to navigate"
  : "Press <space> to select, use arrow keys to navigate";

export async function configure() {
  const logger = log.getLogger("main");
  // Load the project config if it exists
  if (await config.exists()) {
    logger.info("Loading project configuration");
    await config.load();
    return;
  }

  // Otherwise configure it
  logger.info("Configure this project");
  const ciPlatforms = (await Checkbox.prompt({
    message: "Which platforms does this project use?",
    minOptions: 1, // The user must select at least one
    hint: NAV_HINT,
    options: [
      { name: "GitHub Actions", value: "github", checked: false },
      { name: "GitLab CI", value: "gitlab", checked: false },
      { name: "Travis CI (coming soon)", value: "travis", disabled: true },
    ],
  })).filter(isPlatform);

  config.platforms = ciPlatforms;
  config.save();
}
