import { IntrospectFn } from "../deps.ts";
import { hasDependency } from "./utils.ts";

export interface Pytest {
  hasPytest: boolean;
}

export const introspect: IntrospectFn<Pytest | null> = async (context) => {
  return {
    hasPytest: await hasDependency("pytest", context),
  };
};
