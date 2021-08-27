import { IntrospectFn } from "../deps.ts";
import { hasDependency } from "./utils.ts";

export interface Isort {
  hasIsort: boolean;
}

export const introspect: IntrospectFn<Isort | null> = async (context) => {
  return {
    hasIsort: await hasDependency("isort", context),
  };
};
