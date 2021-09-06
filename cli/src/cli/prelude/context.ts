import { context } from "../../plugin/mod.ts";
import { GlobalOptions } from "../types.ts";

/**
 * Apply required changes to the context object
 */
export function contextualize(opts: GlobalOptions) {
  context.suggestDefault = opts.defaultStage;
}
