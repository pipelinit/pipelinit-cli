import { platformWriters } from "../../../../core/plugins/platforms/mod.ts";
import { introspect } from "../../stack/mod.ts";
import { renderTemplates } from "../../template/mod.ts";
import { prelude } from "../prelude/mod.ts";
import { GlobalOptions } from "../types.ts";
import { outputErrors } from "../../plugin/errors.ts";
import { context } from "../../plugin/mod.ts";
import { ensureFile } from "../../../deps.ts";
import { errorCodes } from "../errors.ts";
import { config } from "../../config/mod.ts";

type DefaultOptions = GlobalOptions;

const WARN_NOTHING_DETECTED = `
Check the available stacks at the project README:
https://github.com/pipelinit/pipelinit-cli#support-overview

If your project has one of the available stacks and it
wasn't detected by pipelinit, this is probably a bug. Please
run pipelinit again with the --debug flag and open an issue here:
https://github.com/pipelinit/pipelinit-cli/issues/new

If you didn't see your stack there and wish it to be included,
start a discussion proposing the new stack here:
https://github.com/pipelinit/pipelinit-cli/discussions/new
`;

export default async function (opts: DefaultOptions): Promise<void> {
  await prelude(opts);
  const logger = context.getLogger("main");
  const detected = await introspect();

  if (Object.keys(detected).length === 0) {
    logger.error(WARN_NOTHING_DETECTED);
    Deno.exit(errorCodes.NO_STACK_DETECTED);
  }

  const platforms = config.platforms!;
  for (const platform of platforms) {
    const files = await platformWriters[platform](
      context,
      renderTemplates(platform, detected),
    );
    for (const { path, content } of files) {
      logger.info(`Writing ${path}`);
      await ensureFile(path);
      await Deno.writeTextFile(path, content);
    }
  }

  outputErrors();
}
