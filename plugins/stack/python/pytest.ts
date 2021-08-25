import { IntrospectFn } from "../deps.ts";

export interface Pytest {
  hasPytest: boolean;
}

export const introspect: IntrospectFn<Pytest | null> = async (context) => {
  for await (const file of context.files.each("**/pyproject.toml")) {
    const pyproject = await context.files.readToml(file.path);
    const libs = {
      ...(pyproject?.tool || {}),
      ...(pyproject?.tool.poetry.dependencies || {}),
      ...(pyproject?.tool.poetry["dev-dependencies"] || {}),
    };
    const hasPytest = Object.keys(libs).some((name) =>
      name === "pytest"
    );
    if (hasPytest) {
      return {
        "hasPytest": true,
      };
    }
  }
  for await (const file of context.files.each("**/Pipfile")) {
    const pipfile = await context.files.readToml(file.path);
    const libs = {
      ...(pipfile?.packages || {}),
      ...(pipfile?.["dev-packages"] || {}),
    };
    const hasPytest = Object.keys(libs).some((name) =>
      name === "pytest"
    );
    if (hasPytest) {
      return {
        "hasPytest": true,
      };
    }
  }
  for await (const file of context.files.each("**/requirements.txt")) {
    const requirements = await Deno.readTextFile(file.path);
    if (requirements.includes("pytest")) {
      return {
        "hasPytest": true,
      };
    }
  }
  return {
    "hasPytest": false,
  };
};
