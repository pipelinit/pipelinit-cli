import { GlobalOptions } from "../types.ts";
import { initialize } from "./initialize.ts";
import { setupLogger } from "./logger.ts";

/**
 * Routines that must run before any command
 */
export async function prelude(opts: GlobalOptions) {
  await initialize();
  await setupLogger(opts.debug);
}
