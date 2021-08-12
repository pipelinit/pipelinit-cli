import { Checkbox } from "../../../deps.ts";
import { config } from "../../config/mod.ts";
import { isPlatform } from "../../platform/mod.ts";

export async function initialize() {
  // If the project is already initialized, load the configuration and bail
  if (await config.exists()) {
    await config.load();
    return;
  }

  // Otherwise initialize it
  const ciPlatforms = (await Checkbox.prompt({
    message: "Select CI platforms",
    options: [
      { name: "GitHub Actions", value: "github", checked: true },
      { name: "GitLab CI (coming soon)", value: "gitlab", disabled: true },
    ],
  })).filter(isPlatform);

  config.platforms = ciPlatforms;
  config.save();
}
