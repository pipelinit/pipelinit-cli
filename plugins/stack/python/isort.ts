import { IntrospectFn } from "../deps.ts";

export interface Isort {
  hasIsort: boolean;
}

export const introspect: IntrospectFn<Isort | null> = async (context) => {
  for await (const file of context.files.each("**/pyproject.toml")) {
    const pyproject = await context.files.readToml(file.path);
    const libs = {
      ...(pyproject?.tool || {}),
      ...(pyproject?.tool.poetry.dependencies || {}),
      ...(pyproject?.tool.poetry["dev-dependencies"] || {}),
    };
    const hasIsort = Object.keys(libs).some((name) =>
      name === "isort"
    );
    if (hasIsort) {
      return {
        "hasIsort": true,
      };
    }
  }
  for await (const file of context.files.each("**/Pipfile")) {
    const pipfile = await context.files.readToml(file.path);
    const libs = {
      ...(pipfile?.packages || {}),
      ...(pipfile?.["dev-packages"] || {}),
    };
    const hasIsort = Object.keys(libs).some((name) =>
      name === "isort"
    );
    if (hasIsort) {
      return {
        "hasIsort": true,
      };
    }
  }
  for await (const file of context.files.each("**/requirements.txt")) {
    const requirements = await Deno.readTextFile(file.path);
    if (requirements.includes("isort")) {
      return {
        "hasIsort": true,
      };
    }
  }
  return {
    "hasIsort": false,
  };
};
