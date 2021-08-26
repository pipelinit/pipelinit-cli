import { each, includes, readJSON, readLines, readToml } from "./files.ts";
import { errors } from "./errors.ts";
import { log, semver } from "../../deps.ts";

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
};

export type Context = typeof context;

export type IntrospectFn<T> = (context: Context) => Promise<T>;

export type Introspector<T> = {
  detect: (context: Context) => Promise<boolean>;
  introspect: IntrospectFn<T>;
};
