import { IntrospectFn } from "../../../types.ts";
import { hasRubyDependency } from "./dependencies.ts";

export interface Rubocop {
  name: "rubocop";
  isDependency: boolean;
}

export const introspect: IntrospectFn<Rubocop | null> = async (context) => {
  const isDependency = await hasRubyDependency(context, "rubocop");
  // Search for any of the following files:
  // .rubocop.yml
  // Reference: https://docs.rubocop.org/rubocop/configuration.html#config-file-locations
  const hasRubocopConfig = await context.files.includes(
    "**/.rubocop.yml",
  );

  if (hasRubocopConfig) {
    return {
      name: "rubocop",
      isDependency: isDependency,
    };
  } else if (isDependency) {
    return {
      name: "rubocop",
      isDependency: true,
    };
  }

  return null;
};
