import { introspector as CssIntrospector } from "./css/mod.ts";
import { introspector as JavaScriptIntrospector } from "./javascript/mod.ts";
import { introspector as PythonIntrospector } from "./python/mod.ts";
import { introspector as HtmlIntrospector } from "./html/mod.ts";

import type CSSProject from "./css/mod.ts";
import type JavaScriptProject from "./javascript/mod.ts";
import type PythonProject from "./python/mod.ts";
import type HtmlProject from "./html/mod.ts";

export type ProjectData =
  | CSSProject
  | JavaScriptProject
  | PythonProject
  | HtmlProject;

export type { CSSProject, HtmlProject, JavaScriptProject, PythonProject };

export const introspectors = [
  { name: "css", ...CssIntrospector },
  { name: "javascript", ...JavaScriptIntrospector },
  { name: "python", ...PythonIntrospector },
  { name: "html", ...HtmlIntrospector },
];
