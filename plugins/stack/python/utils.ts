import { Context } from "../../../src/plugin/mod.ts";

export async function hasDependency(
  dependency: string,
  context: Context,
) {
  for await (const file of context.files.each("**/pyproject.toml")) {
    const pyproject = await context.files.readToml(file.path);
    const libs = {
      ...(pyproject?.tool || {}),
      ...(pyproject?.tool.poetry.dependencies || {}),
      ...(pyproject?.tool.poetry["dev-dependencies"] || {}),
    };
    const hasDep = Object.keys(libs).some((name) => name === dependency);
    if (hasDep) {
      return true;
    }
  }
  for await (const file of context.files.each("**/Pipfile")) {
    const pipfile = await context.files.readToml(file.path);
    const libs = {
      ...(pipfile?.packages || {}),
      ...(pipfile?.["dev-packages"] || {}),
    };
    const hasDep = Object.keys(libs).some((name) => name === dependency);
    if (hasDep) {
      return true;
    }
  }
  for await (const file of context.files.each("**/requirements.txt")) {
    const requirements = await Deno.readTextFile(file.path);
    if (requirements.includes(dependency)) {
      return true;
    }
  }
  return false;
}
