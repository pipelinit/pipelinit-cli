import { IntrospectFn } from "../../../types.ts";
import { hasDependencyAny } from "./dependencies.ts";

const nodeWebApps = new Set([
  "express",
  "vue",
  "@angular/cli",
  "ember-cli",
  "react",
  "svelte",
  "gatsby",
  "nuxt",
  "bootstrap",
]);

const denoWebApps = new Set([
  "abc",
  "alosaur",
  "attain",
  "deno-express",
  "denotrain",
  "aqua",
  "dinatra",
  "doa",
  "drash",
  "dragon",
  "microraptor",
  "oak",
  "opine",
  "pogo",
  "servest",
]);

export const introspect: IntrospectFn<string | null> = async (context) => {
  if (
    await hasDependencyAny(context, nodeWebApps) ||
    await hasDependencyAny(context, denoWebApps)
  ) {
    return "webApp";
  }
  return null;
};
