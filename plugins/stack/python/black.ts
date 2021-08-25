import { IntrospectFn } from "../deps.ts";

export interface Black {
  hasBlack: boolean;
}

export const introspect: IntrospectFn<Black | null> = async (context) => {
  for await (const file of context.files.each("**/pyproject.toml")) {
    const pyproject = await context.files.readToml(file.path);
    const libs = {
      ...(pyproject?.tool || {}),
      ...(pyproject?.tool.poetry.dependencies || {}),
      ...(pyproject?.tool.poetry["dev-dependencies"] || {}),
    };
    const hasBlack = Object.keys(libs).some((name) =>
      name === "black"
    );
    if (hasBlack) {
      return {
        "hasBlack": true,
      };
    }
  }
  for await (const file of context.files.each("**/Pipfile")) {
    const pipfile = await context.files.readToml(file.path);
    const libs = {
      ...(pipfile?.packages || {}),
      ...(pipfile?.["dev-packages"] || {}),
    };
    const hasBlack = Object.keys(libs).some((name) =>
      name === "black"
    );
    if (hasBlack) {
      return {
        "hasBlack": true,
      };
    }
  }
  for await (const file of context.files.each("**/requirements.txt")) {
    const requirements = await Deno.readTextFile(file.path);
    if (requirements.includes("black")) {
      return {
        "hasBlack": true,
      };
    }
  }
  return {
    "hasBlack": false,
  };
};
