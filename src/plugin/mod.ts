import { log, semver } from "../../deps.ts";
import { each, includes, readJSON, readLines, readToml } from "./files.ts";
import { errors } from "./errors.ts";
import { VERSION } from "../version.ts";

export const context = {
  getLogger: log.getLogger,
  files: {
    each,
    includes,
    readLines,
    readToml,
    readJSON,
  },
  errors: {
    add: errors.add,
  },
  semver,
  suggestDefault: true,
  version: VERSION,
};

export type Context = typeof context;

export type IntrospectFn<T> = (context: Context) => Promise<T>;

export type Introspector<T> = {
  detect: (context: Context) => Promise<boolean>;
  introspect: IntrospectFn<T>;
};
