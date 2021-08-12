import { IntrospectFn } from "../deps.ts";

interface Npm {
  name: "npm";
}

interface Yarn {
  name: "yarn";
}

export type PackageManager = Npm | Yarn;

export const introspect: IntrospectFn<PackageManager> = async (context) => {
  if (await context.files.includes("**/yarn.lock")) {
    return {
      name: "yarn",
    };
  }

  return {
    name: "npm",
  };
};
