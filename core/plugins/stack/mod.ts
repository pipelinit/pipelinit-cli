import { introspector as CssIntrospector } from "./css/mod.ts";
import { introspector as DockerIntrospector } from "./docker/mod.ts";
import { introspector as HtmlIntrospector } from "./html/mod.ts";
import { introspector as JavaIntrospector } from "./java/mod.ts";
import { introspector as JavaScriptIntrospector } from "./javascript/mod.ts";
import { introspector as MarkdownIntrospector } from "./markdown/mod.ts";
import { introspector as PythonIntrospector } from "./python/mod.ts";
import { introspector as RubyIntrospector } from "./ruby/mod.ts";
import { introspector as ShellIntrospector } from "./shell/mod.ts";
import { introspector as TerraformIntrospector } from "./terraform/mod.ts";

import type CSSProject from "./css/mod.ts";
import type DockerProject from "./docker/mod.ts";
import type HtmlProject from "./html/mod.ts";
import type JavaScriptProject from "./javascript/mod.ts";
import type JavaProject from "./java/mod.ts";
import type MarkdownProject from "./markdown/mod.ts";
import type PythonProject from "./python/mod.ts";
import type RubyProject from "./ruby/mod.ts";
import type ShellProject from "./shell/mod.ts";
import type TerraformProject from "./terraform/mod.ts";

// Keep it in alphabetical order
export type ProjectData =
  | CSSProject
  | DockerProject
  | HtmlProject
  | JavaScriptProject
  | JavaProject
  | MarkdownProject
  | PythonProject
  | RubyProject
  | ShellProject
  | TerraformProject;

export type {
  CSSProject,
  DockerProject,
  HtmlProject,
  JavaProject,
  JavaScriptProject,
  MarkdownProject,
  PythonProject,
  RubyProject,
  ShellProject,
  TerraformProject,
};

export const introspectors = [
  { name: "css", ...CssIntrospector },
  { name: "docker", ...DockerIntrospector },
  { name: "html", ...HtmlIntrospector },
  { name: "javascript", ...JavaScriptIntrospector },
  { name: "java", ...JavaIntrospector },
  { name: "markdown", ...MarkdownIntrospector },
  { name: "python", ...PythonIntrospector },
  { name: "ruby", ...RubyIntrospector },
  { name: "shell", ...ShellIntrospector },
  { name: "terraform", ...TerraformIntrospector },
];
