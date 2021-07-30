import {
  loadPlugins as loadTemplates,
  run as renderTemplate,
} from "../plugins/templates.ts";
import { loadPlugins as loadPlatforms } from "../plugins/platforms.ts";
import { RenderedTemplate } from "../../plugins/mod.ts";

type Maybe<T> = T | null;

function isntNull<T>(v: Maybe<T>): v is T {
  return v !== null;
}

export default async function (): Promise<void> {
  const platforms = (await loadPlatforms()).filter((p) => p.detect());
  const platformIds = platforms.map((p) => p.platform);
  const templatePlugins = await loadTemplates();
  const renderedTemplates = (await Promise.all(
    templatePlugins
      .filter((t) => platformIds.includes(t.platform))
      .map<Promise<Maybe<RenderedTemplate>>>(async (template) => {
        const output = await renderTemplate(template);
        return output === null ? null : { template, output };
      }),
  )).filter(isntNull);
  await Promise.all(
    platforms.map((platform) => {
      platform.output(
        renderedTemplates
          .filter((t) => t.template.platform == platform.platform),
      );
    }),
  );
}
