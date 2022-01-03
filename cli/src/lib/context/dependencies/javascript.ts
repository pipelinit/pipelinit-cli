import { Context } from "../../../../deps.ts";

const denoDepRegex = /\/\/.*\/(?<DependencyName>.+?)(?=\/|@)/gm;

function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined;
}

export const jsNodeDependency = async (context: Context) => {
  const dependencies: string[] = [];

  for await (const file of context.files.each("**/package.json")) {
    const packageJson = await context.files.readJSON(file.path);

    const nodeDeps = packageJson?.dependencies;
    if (nodeDeps) {
      dependencies.push(...Object.keys(nodeDeps));
    }

    const nodeDepsDev = packageJson?.devDependencies;
    if (nodeDepsDev) {
      dependencies.push(...Object.keys(nodeDepsDev));
    }
  }

  return dependencies;
};

export const jsDenoDependency = async (context: Context) => {
  for await (const file of await context.files.each("**/deps.ts")) {
    const denoDepsText = await context.files.readText(file.path);

    const depsDeno: string[] = Array.from(
      denoDepsText.matchAll(denoDepRegex),
      (match) => !match.groups ? null : match.groups.DependencyName,
    ).filter(notEmpty);

    if (depsDeno) {
      return depsDeno;
    }
  }
  return [];
};
