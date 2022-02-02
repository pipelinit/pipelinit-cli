import { IntrospectFn } from "../../../../types.ts";
import { hasDependency } from "../../javascript/dependencies.ts";

export interface Stylelint {
  name: "stylelint";
  isDependency: boolean;
}

export const introspect: IntrospectFn<Stylelint | null> = async (context) => {
  const isDependency = await hasDependency(context, "stylelint");
  let hasStylelintConfig = false;

  for await (const file of context.files.each("**/package.json")) {
    const packageJson = await context.files.readJSON(file.path);
    hasStylelintConfig = packageJson.stylelint != null;
  }

  if (hasStylelintConfig) {
    return {
      name: "stylelint",
      isDependency: isDependency,
    };
  } else if (isDependency) {
    return {
      name: "stylelint",
      isDependency: true,
    };
  }

  return null;
};
