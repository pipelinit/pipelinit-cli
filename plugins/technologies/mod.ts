import { introspector as JavaScriptIntrospector } from "./javascript/mod.ts";
import { introspector as PythonIntrospector } from "./python/mod.ts";

export const introspectors = {
  javascript: JavaScriptIntrospector,
  python: PythonIntrospector,
};
export type technologies = keyof typeof introspectors;
