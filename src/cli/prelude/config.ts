import { Checkbox, log } from "../../../deps.ts";
import { config } from "../../config/mod.ts";
import { isPlatform } from "../../platform/mod.ts";

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
    options: [
      { name: "GitHub Actions", value: "github", checked: true },
      { name: "GitLab CI (coming soon)", value: "gitlab", disabled: true },
    ],
  })).filter(isPlatform);

  config.platforms = ciPlatforms;
  config.save();
}
