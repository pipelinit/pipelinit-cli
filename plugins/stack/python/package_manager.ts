import { IntrospectFn } from "../deps.ts";

interface Pip {
  name: "pip",
  dependenciesCommand: "pip install -r requirements.txt",
  installCommand: "pip install",
  runCommand: "";
}

interface Poetry {
  name: "poetry",
  dependenciesCommand: "poetry install",
  installCommand: "poetry add",
  runCommand: "poetry run";
}

interface Pipenv {
  name: "pipenv",
  dependenciesCommand: "pipenv install",
  installCommand: "pipenv install",
  runCommand: "pipenv run";
}

export type PackageManager = Pip | Poetry | Pipenv;

export const introspect: IntrospectFn<PackageManager> = async (context) => {
  if (await context.files.includes("**/pyproject.toml")) {
    for await (const file of context.files.each("**/pyproject.toml")) {
      const content = await Deno.readTextFile(file.path)
      if (content.includes("poetry")) {
        return {
          name: "poetry",
          dependenciesCommand: "poetry install",
          installCommand: "poetry add",
          runCommand: "poetry run"
        }
      }
    }
  }

  if (await context.files.includes("**/Pipfile")){
    return {
      name: "pipenv",
      dependenciesCommand: "pipenv install",
      installCommand: "pipenv install",
      runCommand: "pipenv run"
    }
  }

  return {
    name: "pip",
    dependenciesCommand: "pip install -r requirements.txt",
    installCommand: "pip install",
    runCommand: ""
  }
};
