import { files, hasAnyFile, readLines } from "./files.ts";

export const introspectionContext = {
  helpers: {
    files,
    hasAnyFile,
    readLines,
  },
};

export type Context = typeof introspectionContext;

export type IntrospectFn<T> = (context: Context) => Promise<T>;

export type Introspector<T> = {
  detect: (context: Context) => Promise<boolean>;
  introspect: IntrospectFn<T>;
};
