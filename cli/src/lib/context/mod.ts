import { Context, log, PIPELINIT_VERSION, semver } from "../../../deps.ts";
import { GlobalOptions } from "../../options.ts";
import {
  each,
  includes,
  readJSON,
  readLines,
  readText,
  readToml,
} from "./files.ts";
import { errors, outputErrors } from "./errors.ts";
export { outputErrors };

export const context: Context = {
  getLogger: log.getLogger,
  files: {
    each,
    includes,
    readJSON,
    readLines,
    readText,
    readToml,
  },
  errors: {
    add: errors.add,
  },
  semver,
  suggestDefault: true,
  version: PIPELINIT_VERSION,
};

/**
 * Apply required changes to the context object
 */
export function contextualize(opts: GlobalOptions) {
  context.suggestDefault = opts.defaultStage;
}
