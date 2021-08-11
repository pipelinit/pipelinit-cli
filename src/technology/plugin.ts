import { files, hasAnyFile, readLines } from "./helpers/mod.ts";
import { log } from "../../deps.ts";

const logger = {
  debug: log.debug,
  info: log.info,
  warning: log.warning,
  error: log.error,
};

export const context = {
  logger,
  helpers: {
    files,
    hasAnyFile,
    readLines,
  },
};

export type Context = typeof context;

export type IntrospectFn<T> = (context: Context) => Promise<T>;

export type Introspector<T> = {
  detect: (context: Context) => Promise<boolean>;
  introspect: IntrospectFn<T>;
};
