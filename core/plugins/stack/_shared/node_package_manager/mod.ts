import { IntrospectFn } from "../../../../types.ts";

interface Npm {
  name: "npm";
}

interface Yarn {
  name: "yarn";
}

export type NodePackageManager = Npm | Yarn;

export const introspect: IntrospectFn<NodePackageManager> = async (context) => {
  if (await context.files.includes("**/yarn.lock")) {
    return {
      name: "yarn",
    };
  }

  return {
    name: "npm",
  };
};
