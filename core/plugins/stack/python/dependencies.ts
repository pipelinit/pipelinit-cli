import { Context } from "../../../types.ts";

const readDependencyFile = async (context: Context) => {
  const dependencies: string[] = [];

  for await (const file of context.files.each("**/pyproject.toml")) {
    const pyproject = await context.files.readToml(file.path);

    const poetryDeps = pyproject.tool?.poetry?.dependencies;
    if (poetryDeps) {
      dependencies.push(...Object.keys(poetryDeps));
    }
    const poetryDevDeps = pyproject.tool?.poetry["dev-dependencies"];
    if (poetryDevDeps) {
      dependencies.push(...Object.keys(poetryDevDeps));
    }
  }

  for await (const file of context.files.each("**/Pipfile")) {
    const pipfile = await context.files.readToml(file.path);

    const pipFileDeps = pipfile.packages;
    if (pipFileDeps) {
      dependencies.push(...Object.keys(pipFileDeps));
    }
    const pipFileDevDeps = pipfile["dev-packages"];
    if (pipFileDevDeps) {
      dependencies.push(...Object.keys(pipFileDevDeps));
    }
  }

  for await (const file of context.files.each("**/requirements.txt")) {
    const requirements = await context.files.readText(file.path);
    // Using a modified version of the regex pointed on the PEP 508
    // The only difference is the matching of the dependency version number was removed
    // Reference: https://www.python.org/dev/peps/pep-0508/#names
    const reqDeps = requirements.match(/[A-Z][A-Z_-]*[A-Z0-9]/gmi);
    if (reqDeps) {
      dependencies.push(...reqDeps);
    }
  }

  return dependencies;
};

export const hasPythonDependency = async (
  context: Context,
  dependencyName: string,
): Promise<boolean> => {
  const dependencies = await readDependencyFile(context);
  return dependencies.some((dep) => dep === dependencyName);
};

export const hasPythonDependencyAny = async (
  context: Context,
  dependencyList: Set<string>,
): Promise<boolean> => {
  const dependencies = await readDependencyFile(context);
  return dependencies.some((dep) => dependencyList.has(dep));
};
