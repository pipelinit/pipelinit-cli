import { IntrospectFn } from "../../../../types.ts";

export interface Stylelint {
  name: "stylelint";
}

export const introspect: IntrospectFn<Stylelint | null> = async (context) => {
  for await (const file of context.files.each("**/package.json")) {
    const packageJson = await context.files.readJSON(file.path);
    const packages = {
      ...(packageJson?.dependencies || {}),
      ...(packageJson?.devDependencies || {}),
    };
    const hasStylelint = Object.keys(packages).some((name) =>
      name === "stylelint"
    );
    if (hasStylelint) {
      return {
        "name": "stylelint",
      };
    }
  }

  return null;
};
