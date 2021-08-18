import { IntrospectFn } from "../deps.ts";

interface ESLint {
  name: "eslint";
  hasIgnoreFile: boolean;
}

export type Linter = ESLint | null;

export const introspect: IntrospectFn<Linter> = async (context) => {
  // See https://eslint.org/docs/user-guide/configuring/ignoring-code
  const hasIgnoreFile = await context.files.includes("**/.eslintignore");

  // Search for any of the following files:
  // .eslintrc.js
  // .eslintrc.cjs
  // .eslintrc.yaml
  // .eslintrc.yml
  // .eslintrc.json
  let hasESLintConfig = await context.files.includes(
    "**/.eslintrc.{js,cjs,yaml,yml,json}",
  );
  // If didn't find any of the options above, look for the "eslintConfig"
  // property inside package.json.
  //
  // See:
  // https://eslint.org/docs/user-guide/configuring/configuration-files#configuration-file-formats
  if (!hasESLintConfig) {
    for await (const file of context.files.each("**/package.json")) {
      const packageJson = await context.files.readJSON(file.path);
      hasESLintConfig = Object.keys(packageJson).includes("eslintConfig");
    }
  }

  if (hasESLintConfig) {
    return {
      name: "eslint",
      hasIgnoreFile,
    };
  }

  return null;
};
