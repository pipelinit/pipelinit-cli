import { Checkbox } from "../../../deps.ts";
import { config } from "../../config/mod.ts";
import { isPlatform } from "../../platform/mod.ts";

export async function initialize() {
  // Bail if the project is already initialized
  if (await config.exists()) return;

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
