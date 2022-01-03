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
import { introspector as YamlIntrospector } from "./yaml/mod.ts";

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
import type YamlProject from "./yaml/mod.ts";

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
  | TerraformProject
  | YamlProject;

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
  YamlProject,
};

export type CSS = "css";
export type HTML = "html";
export type Docker = "docker";
export type JavaScript = "javascript";
export type Java = "java";
export type Markdown = "markdown";
export type Python = "python";
export type Ruby = "ruby";
export type Shell = "shell";
export type Terraform = "terraform";
export type Yaml = "yaml";

export const introspectors = [
  { name: <CSS> "css", ...CssIntrospector },
  { name: <HTML> "docker", ...DockerIntrospector },
  { name: <Docker> "html", ...HtmlIntrospector },
  { name: <JavaScript> "javascript", ...JavaScriptIntrospector },
  { name: <Java> "java", ...JavaIntrospector },
  { name: <Markdown> "markdown", ...MarkdownIntrospector },
  { name: <Python> "python", ...PythonIntrospector },
  { name: <Ruby> "ruby", ...RubyIntrospector },
  { name: <Shell> "shell", ...ShellIntrospector },
  { name: <Terraform> "terraform", ...TerraformIntrospector },
  { name: <Yaml> "yaml", ...YamlIntrospector },
];
