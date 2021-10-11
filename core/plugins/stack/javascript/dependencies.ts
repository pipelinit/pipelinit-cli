import { Context } from "../../../types.ts";

const denoDepRegex = /\/\/.*\/(?<DependencyName>.+?)(?=\/|@)/gm;

function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined;
}

const readNodeDependencyFile = async (context: Context) => {
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

const readDenoDependencyFile = async (context: Context) => {
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

export const hasDependency = async (
  context: Context,
  dependencyName: string,
): Promise<boolean> => {
  const nodeDependencies = await readNodeDependencyFile(context);
  if (nodeDependencies.length > 0) {
    return nodeDependencies.some((dep) => dep === dependencyName);
  }

  const denoDependencies = await readDenoDependencyFile(context);
  if (denoDependencies.length > 0) {
    return denoDependencies.some((dep) => dep === dependencyName);
  }

  return false;
};

export const hasDependencyAny = async (
  context: Context,
  dependencyList: Set<string>,
): Promise<boolean> => {
  const nodeDependencies = await readNodeDependencyFile(context);
  if (nodeDependencies.length > 0) {
    return nodeDependencies.some((dep) => dependencyList.has(dep));
  }

  const denoDependencies = await readDenoDependencyFile(context);
  if (denoDependencies.length > 0) {
    return denoDependencies.some((dep) => dependencyList.has(dep));
  }

  return false;
};
