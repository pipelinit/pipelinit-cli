import { eta, join, parse } from "../../deps.ts";
import { RenderedTemplate } from "../platform/plugin.ts";
import { ProjectTechnology } from "../technology/mod.ts";

/**
 * Render every available CI configuration template for a given platform,
 * searching from the given root, yields each result as they're rendered.
 *
 * The expected directory structure follows:
 * ```
 * .                                # ROOT
 * └── ci-platform                  # CI platform name
 *     ├── technology1
 *     │   ├── lint.yaml
 *     │   └── test.yaml
 *     └── technology2
 *         └── lint.yaml
 * ```
 *
 * For example, if the introspection step discovered technology1 and the
 * project uses `ci-platform`, this routine renders the files
 * `ci-platform/technology1/lint.yaml` and `ci-platform/technology1/test.yaml`
 * yielding objects with the rendered content and the names
 * "pipelinit.technology1.lint" and "pipelinit.technology1.test" respectivly.
 *
 * It's up to a CI platform plugin to determine how to write those results
 * in the filesystem.
 */
export async function* renderTemplates(
  root: string,
  platform: string,
  projectData: ProjectTechnology,
): AsyncIterableIterator<RenderedTemplate> {
  for (const [technology, data] of Object.entries(projectData)) {
    const dir = join(root, `templates/${platform}/${technology}/`);
    for await (const dirEntry of Deno.readDir(dir)) {
      const templatePath = join(dir, dirEntry.name);
      const filename = parse(templatePath).name;
      const content = await eta.renderFile(templatePath, data);
      yield {
        name: `pipelinit.${technology}.${filename}`,
        content,
      };
    }
  }
  return;
}
