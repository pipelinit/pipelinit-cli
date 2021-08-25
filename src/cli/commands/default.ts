import { platformWriters } from "../../../plugins/platforms/mod.ts";
import { introspect } from "../../stack/mod.ts";
import { renderTemplates } from "../../template/mod.ts";
import { prelude } from "../prelude/mod.ts";
import { GlobalOptions } from "../types.ts";
import { outputErrors } from "../../plugin/errors.ts";

type DefaultOptions = GlobalOptions;

export default async function (opts: DefaultOptions): Promise<void> {
  await prelude(opts);
  const detected = await introspect();
  const platform = "github";
  await platformWriters[platform](
    renderTemplates(platform, detected),
  );
  outputErrors();
}
