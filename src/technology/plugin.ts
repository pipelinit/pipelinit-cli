import {
  askOption,
  files,
  hasAnyFile,
  readLines,
  readToml,
} from "./helpers/mod.ts";
import { log } from "../../deps.ts";

export const context = {
  getLogger: log.getLogger,
  helpers: {
    askOption,
    files,
    hasAnyFile,
    readLines,
    readToml,
  },
};

export type Context = typeof context;

export type IntrospectFn<T> = (context: Context) => Promise<T>;

export type Introspector<T> = {
  detect: (context: Context) => Promise<boolean>;
  introspect: IntrospectFn<T>;
};
