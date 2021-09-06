import { GlobalOptions } from "../types.ts";
import { configure } from "./config.ts";
import { setupLogger } from "./logger.ts";
import { contextualize } from "./context.ts";

/**
 * Routines that must run before any command
 */
export async function prelude(opts: GlobalOptions) {
  await setupLogger(opts.debug);
  await configure();
  contextualize(opts);
}
