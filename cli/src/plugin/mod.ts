import { Context, log, semver } from "../../deps.ts";
import {
  each,
  includes,
  readJSON,
  readLines,
  readText,
  readToml,
} from "./files.ts";
import { errors } from "./errors.ts";
import { VERSION } from "../version.ts";

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
  version: VERSION,
};
