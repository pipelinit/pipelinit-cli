import { ensureFile, fileExists, parseIniFile } from "../../deps.ts";
import { Platform, RenderedTemplate } from "../mod.ts";

export default class GitHub implements Platform {
  platform: "GITHUB";

  constructor() {
    this.platform = "GITHUB";
  }

  async detect(): Promise<boolean> {
    // Bail if it isn't a git repository
    if (!await fileExists(".git/config")) {
      return false;
    }
    const gitConfig = await Deno.readTextFile(".git/config");
    const parsedGitConfig = parseIniFile(gitConfig);
    for (const [k, v] of Object.entries<any>(parsedGitConfig)) {
      if (k.includes("remote") && "url" in v) {
        const remoteUrl: string = v.url;
        // FIXME: this is very weak, improve this check
        if (remoteUrl.includes("github.com")) {
          return true;
        }
      }
    }
    return false;
  }

  async output(templates: RenderedTemplate[]): Promise<void> {
    for (const template of templates) {
      const { output, template: { id } } = template;
      await ensureFile(`.github/workflows/${id}.yaml`);
      await Deno.writeTextFile(`.github/workflows/${id}.yaml`, output);
    }
  }
}
