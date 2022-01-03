import { IntrospectFn } from "../../../types.ts";

export interface Bandit {
  name: "bandit";
  isDependency: boolean;
}

export const introspect: IntrospectFn<Bandit | null> = async (context) => {
  const isDependency = await context.dependencies.includes("bandit");

  if (isDependency) {
    return {
      name: "bandit",
      isDependency: true,
    };
  }

  return null;
};
