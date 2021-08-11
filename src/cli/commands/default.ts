import { PIPELINIT_ROOT } from "../../../pipelinit.ts";
import { platformWriters } from "../../../plugins/platforms/mod.ts";
import { introspect } from "../../technology/mod.ts";
import { renderTemplates } from "../../template/mod.ts";
import { GlobalOptions, prelude } from "../global.ts";

type DefaultOptions = GlobalOptions;

export default async function (opts: DefaultOptions): Promise<void> {
  await prelude(opts);
  const detected = await introspect();
  const platform = "github";
  await platformWriters[platform](
    renderTemplates(PIPELINIT_ROOT, platform, detected),
  );
}
