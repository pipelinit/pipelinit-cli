import { introspector as JavaScriptIntrospector } from "./javascript/mod.ts";
import { introspector as PythonIntrospector } from "./python/mod.ts";

import type JavaScriptProject from "./javascript/mod.ts";
import type PythonProject from "./python/mod.ts";

export type ProjectData =
  | JavaScriptProject
  | PythonProject;

export const introspectors = [
  { name: "javascript", ...JavaScriptIntrospector },
  { name: "python", ...PythonIntrospector },
];
