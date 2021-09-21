import { IntrospectFn } from "../../../../types.ts";

interface Npm {
  name: "npm";
  commands: {
    install: "npm ci";
  };
}

interface Yarn {
  name: "yarn";
  commands: {
    install: "yarn";
  };
}

export type NodePackageManager = Npm | Yarn;

export const introspect: IntrospectFn<NodePackageManager> = async (context) => {
  if (await context.files.includes("**/yarn.lock")) {
    return {
      name: "yarn",
      commands: {
        install: "yarn",
      },
    };
  }

  return {
    name: "npm",
    commands: {
      install: "npm ci",
    },
  };
};
