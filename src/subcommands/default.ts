import { PIPELINIT_ROOT } from "../../pipelinit.ts";
import { platformWriters } from "../../plugins/platforms/mod.ts";

import { introspect } from "../technology/mod.ts";
import { renderTemplates } from "../template/mod.ts";

export default async function (): Promise<void> {
  const detected = await introspect();
  const platform = "github";
  await platformWriters[platform](
    renderTemplates(PIPELINIT_ROOT, platform, detected),
  );
}
