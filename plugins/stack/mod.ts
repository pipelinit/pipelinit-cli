import { introspector as CssIntrospector } from "./css/mod.ts";
import { introspector as JavaScriptIntrospector } from "./javascript/mod.ts";
import { introspector as PythonIntrospector } from "./python/mod.ts";

import type CSSProject from "./css/mod.ts";
import type JavaScriptProject from "./javascript/mod.ts";
import type PythonProject from "./python/mod.ts";

export type ProjectData =
  | CSSProject
  | JavaScriptProject
  | PythonProject;

export type { CSSProject, JavaScriptProject, PythonProject };

export const introspectors = [
  { name: "css", ...CssIntrospector },
  { name: "javascript", ...JavaScriptIntrospector },
  { name: "python", ...PythonIntrospector },
];
