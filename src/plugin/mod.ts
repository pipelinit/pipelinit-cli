import { config } from "../config/mod.ts";
import { each, includes, readJSON, readLines, readToml } from "./files.ts";
import { askOption } from "./cli.ts";
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
  cli: {
    askOption,
  },
  config,
  semver,
};

export type Context = typeof context;

export type IntrospectFn<T> = (context: Context) => Promise<T>;

export type Introspector<T> = {
  detect: (context: Context) => Promise<boolean>;
  introspect: IntrospectFn<T>;
};
