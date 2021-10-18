import { ensureFile, platformWriters } from "../../deps.ts";
import {
  anyError,
  config,
  context,
  introspect,
  outputErrors,
  renderTemplates,
} from "../lib/mod.ts";
import { GlobalOptions } from "../options.ts";
import { errorCodes } from "../errors.ts";
import { prelude } from "./prelude.ts";

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

/**
 * Handles the case when no pipeline could be generated.
 * If there are any errors, that means every detected stack had one (or more)
 * error(s) that prevented the pipeline generation. Otherwise, no stack was
 * recognized.
 */
function handleEmptyPipeline(): never {
  const logger = context.getLogger("main");
  if (anyError()) {
    outputErrors();
    Deno.exit(errorCodes.ALL_STACKS_WITH_ERRORS);
  } else {
    logger.error(WARN_NOTHING_DETECTED);
    Deno.exit(errorCodes.NO_STACK_DETECTED);
  }
}

type UnPromisify<T> = T extends Promise<infer U> ? U : T;
type Stack = UnPromisify<ReturnType<typeof introspect>>;

/**
 * Renders and writes each CI configuration file with the project introspected
 * data
 */
async function outputPipeline(detected: Stack) {
  const logger = context.getLogger("main");
  const platforms = config.platforms!;
  await Promise.all(platforms.map(async (platform) => {
    const platformWriter = platformWriters[platform];
    const renderIterator = renderTemplates(platform, detected);
    const files = await platformWriter(context, renderIterator);
    await Promise.all(files.map(async ({ path, content }) => {
      logger.info(`Writing ${path}`);
      await ensureFile(path);
      await Deno.writeTextFile(path, content);
    }));
  }));
}

/**
 * The default Pipelinit CLI command detects a project Stack and write
 * CI pipeline configuration files for the selected CI platform.
 */
export default async function (opts: DefaultOptions): Promise<void> {
  await prelude(opts);
  const detected = await introspect();
  if (Object.keys(detected).length === 0) {
    handleEmptyPipeline();
  } else {
    await outputPipeline(detected);
    outputErrors();
  }
}
