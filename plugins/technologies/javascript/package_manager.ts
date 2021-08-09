import { IntrospectFn } from "../../introspection/mod.ts";

interface Npm {
  name: "npm";
}

interface Yarn {
  name: "yarn";
}

export type PackageManager = Npm | Yarn;

export const introspect: IntrospectFn<PackageManager> = async (context) => {
  const { helpers } = context;

  if (await helpers.hasAnyFile("**/yarn.lock")) {
    return {
      name: "yarn",
    };
  }

  return {
    name: "npm",
  };
};
