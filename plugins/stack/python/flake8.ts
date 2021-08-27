import { IntrospectFn } from "../deps.ts";
import { hasDependency } from "./utils.ts";

export interface Flake8 {
  hasFlake8: boolean;
}

export const introspect: IntrospectFn<Flake8 | null> = async (context) => {
  return {
    hasFlake8: await hasDependency("flake8", context),
  };
};
