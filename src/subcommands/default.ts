import { BUILTIN, run as runPlugin } from "../plugins/templates.ts";
import { detectPlatforms } from "../platforms/detect.ts";

export default async function (templates: Array<string>): Promise<void> {
  const platforms = await detectPlatforms();
  const templatePlugins = [...templates, ...BUILTIN];
  await Promise.all(templatePlugins.map((tp) => runPlugin(tp, platforms)));
}
