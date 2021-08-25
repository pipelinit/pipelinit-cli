import { IntrospectFn } from "../deps.ts";

export interface Flake8 {
  hasFlake8: boolean;
}

export const introspect: IntrospectFn<Flake8 | null> = async (context) => {
  for await (const file of context.files.each("**/pyproject.toml")) {
    const pyproject = await context.files.readToml(file.path);
    const libs = {
      ...(pyproject?.tool || {}),
      ...(pyproject?.tool.poetry.dependencies || {}),
      ...(pyproject?.tool.poetry["dev-dependencies"] || {}),
    };
    const hasFlake8 = Object.keys(libs).some((name) =>
      name === "flake8"
    );
    if (hasFlake8) {
      return {
        "hasFlake8": true,
      };
    }
  }
  for await (const file of context.files.each("**/Pipfile")) {
    const pipfile = await context.files.readToml(file.path);
    const libs = {
      ...(pipfile?.packages || {}),
      ...(pipfile?.["dev-packages"] || {}),
    };
    const hasFlake8 = Object.keys(libs).some((name) =>
      name === "flake8"
    );
    if (hasFlake8) {
      return {
        "hasFlake8": true,
      };
    }
  }
  for await (const file of context.files.each("**/requirements.txt")) {
    const requirements = await Deno.readTextFile(file.path);
    if (requirements.includes("flake8")) {
      return {
        "hasFlake8": true,
      };
    }
  }
  return {
    "hasFlake8": false,
  };
};
