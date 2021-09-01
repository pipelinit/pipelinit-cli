import { eta, join, loadBuckets, parse } from "../../deps.ts";
import { RenderedTemplate } from "../platform/plugin.ts";
import { Stack } from "../stack/mod.ts";
import bucketsConf from "../../buckets.ts";

/**
 * Common interface for loading templates from embedded buckets or file system
 */
interface Template {
  name: string;
  content: string;
}

/**
 * Load CI templates from an specified directory (root)
 */
async function* loadTemplateFromFs(
  root: string,
  platform: string,
  stack: string,
): AsyncIterableIterator<Template> {
  const dir = join(root, `templates/${platform}/${stack}/`);
  for await (const dirEntry of Deno.readDir(dir)) {
    const templatePath = join(dir, dirEntry.name);
    const filename = parse(templatePath).name;
    const content = await Deno.readTextFile(templatePath);
    yield {
      name: filename,
      content: content,
    };
  }
  return;
}

/**
 * Load embedded CI templates from buckets. Those templates are available from
 * within the final executable and require no downloads or fs lookup
 */
async function* loadTemplateFromBuckets(
  platform: string,
  stack: string,
): AsyncIterableIterator<Template> {
  const buckets = loadBuckets(bucketsConf);
  for (const [entry, template] of Object.entries(buckets.templates)) {
    if (
      typeof template === "string" &&
      entry.includes(`${platform}/${stack}/`)
    ) {
      const filename = parse(entry).name;
      yield {
        name: filename,
        content: template,
      };
    }
  }
  return;
}

/**
 * Render every available CI configuration template for a given platform,
 * yields each result as they're rendered.
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
 *
 * If `root` is specified, it walks through that directory, otherwise it uses
 * the builtin (embeded) templates.
 */
export async function* renderTemplates(
  platform: string,
  projectData: Stack,
  root?: string,
): AsyncIterableIterator<RenderedTemplate> {
  for (const [stack, data] of Object.entries(projectData)) {
    const templates = root
      ? loadTemplateFromFs(root, platform, stack)
      : loadTemplateFromBuckets(platform, stack);
    for await (const template of templates) {
      const content = await eta.render(template.content, data, {
        autoTrim: false,
      });
      if (typeof content === "string" && content) {
        yield {
          name: `pipelinit.${stack}.${template.name}`,
          content,
        };
      }
    }
  }
  return;
}
