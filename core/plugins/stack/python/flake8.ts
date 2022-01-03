import { IntrospectFn } from "../../../types.ts";

export interface Flake8 {
  name: "flake8";
  isDependency: boolean;
}

export const introspect: IntrospectFn<Flake8 | null> = async (context) => {
  const isDependency = await context.dependencies.includes("flake8");
  // Search for any of the following files:
  // .flake8
  const hasFlake8Config = await context.files.includes(
    "**/.flake8",
  );

  if (hasFlake8Config) {
    return {
      name: "flake8",
      isDependency: isDependency,
    };
  } else if (isDependency) {
    return {
      name: "flake8",
      isDependency: true,
    };
  }

  return null;
};
