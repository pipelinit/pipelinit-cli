import { GlobalOptions } from "../options.ts";
import { configure, contextualize, setupLogger } from "../lib/mod.ts";

/**
 * Routines that must run before any command
 */
export async function prelude(opts: GlobalOptions) {
  await setupLogger(opts.debug);
  await configure();
  contextualize(opts);
}
