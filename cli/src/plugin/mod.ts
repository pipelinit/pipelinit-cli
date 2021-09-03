import { Context, log, PIPELINIT_VERSION, semver } from "../../deps.ts";
import {
  each,
  includes,
  readJSON,
  readLines,
  readText,
  readToml,
} from "./files.ts";
import { errors } from "./errors.ts";

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
