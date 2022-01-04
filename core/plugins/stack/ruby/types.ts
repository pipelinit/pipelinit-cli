import { IntrospectFn } from "../../../types.ts";
import { hasRubyDependencyAny } from "./dependencies.ts";

const webApps = new Set([
  "rails",
  "rack",
  "sinatra",
  "hanami",
  "padrino",
  "roda",
]);

export const introspect: IntrospectFn<string | null> = async (context) => {
  if (await hasRubyDependencyAny(context, webApps)) {
    return "webApp";
  }
  return null;
};
