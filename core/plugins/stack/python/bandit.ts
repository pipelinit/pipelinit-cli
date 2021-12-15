import { IntrospectFn } from "../../../types.ts";
import { hasPythonDependency } from "./dependencies.ts";

export interface Bandit {
  name: "bandit";
  isDependency: boolean;
}

export const introspect: IntrospectFn<Bandit | null> = async (context) => {
  const isDependency = await hasPythonDependency(context, "bandit");

  if (isDependency) {
    return {
      name: "bandit",
      isDependency: true,
    };
  }

  return null;
};
