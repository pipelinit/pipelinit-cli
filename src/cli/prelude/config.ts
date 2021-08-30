import { Checkbox, log } from "../../../deps.ts";
import { config } from "../../config/mod.ts";
import { isPlatform } from "../../platform/mod.ts";

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
      { name: "GitHub Actions", value: "github", checked: true },
      { name: "GitLab CI (coming soon)", value: "gitlab", disabled: true },
    ],
  })).filter(isPlatform);

  config.platforms = ciPlatforms;
  config.save();
}
