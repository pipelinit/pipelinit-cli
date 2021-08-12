import { eta, join, parse } from "../../deps.ts";
import { RenderedTemplate } from "../platform/plugin.ts";
import { Stack } from "../stack/mod.ts";

/**
 * Render every available CI configuration template for a given platform,
 * searching from the given root, yields each result as they're rendered.
 *
 * The expected directory structure follows:
 * ```
 * .                                # ROOT
 * └── ci-platform                  # CI platform name
 *     ├── stack1
 *     │   ├── lint.yaml
 *     │   └── test.yaml
 *     └── stack2
 *         └── lint.yaml
 * ```
 *
 * For example, if the introspection step discovered stack1 and the
 * project uses `ci-platform`, this routine renders the files
 * `ci-platform/stack1/lint.yaml` and `ci-platform/stack1/test.yaml`
 * yielding objects with the rendered content and the names
 * "pipelinit.stack1.lint" and "pipelinit.stack1.test" respectivly.
 *
 * It's up to a CI platform plugin to determine how to write those results
 * in the filesystem.
 */
export async function* renderTemplates(
  root: string,
  platform: string,
  projectData: Stack,
): AsyncIterableIterator<RenderedTemplate> {
  for (const [stack, data] of Object.entries(projectData)) {
    const dir = join(root, `templates/${platform}/${stack}/`);
    for await (const dirEntry of Deno.readDir(dir)) {
      const templatePath = join(dir, dirEntry.name);
      const filename = parse(templatePath).name;
      const content = await eta.renderFile(templatePath, data, {
        autoTrim: false,
      });
      yield {
        name: `pipelinit.${stack}.${filename}`,
        content,
      };
    }
  }
  return;
}
