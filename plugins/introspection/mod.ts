import { files, hasAnyFile, readLines } from "./files.ts";

export const context = {
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
