import { IntrospectFn } from "../../../types.ts";
import { hasPythonDependency } from "./dependencies.ts";

export interface PyLint {
  name: "pylint";
  isDependency: boolean;
  hasConfig: boolean;
}

export const introspect: IntrospectFn<PyLint | null> = async (context) => {
  const isDependency = await hasPythonDependency(context, "pylint");
  let hasPyLintConfig = false;

  for await (const file of context.files.each("**/pyproject.toml")) {
    const pyproject = await context.files.readToml(file.path);
    hasPyLintConfig = pyproject.tool?.pylint != null;
  }

  if (!hasPyLintConfig) {
    hasPyLintConfig = await context.files.includes(
      "**/.pylintrc",
    );
  }

  if (hasPyLintConfig) {
    return {
      name: "pylint",
      isDependency: isDependency,
      hasConfig: true,
    };
  } else if (isDependency) {
    return {
      name: "pylint",
      isDependency: true,
      hasConfig: hasPyLintConfig,
    };
  }
  return null;
};
