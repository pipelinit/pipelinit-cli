import { IntrospectFn } from "../../../types.ts";

const webApps = new Set([
  "rails",
  "rack",
  "sinatra",
  "hanami",
  "padrino",
  "roda",
]);

export const introspect: IntrospectFn<string | null> = async (context) => {
  if ((await context.dependencies.some((dep) => webApps.has(dep)))) {
    return "webApp";
  }
  return null;
};
