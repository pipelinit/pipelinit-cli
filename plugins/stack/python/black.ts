import { IntrospectFn } from "../deps.ts";
import { hasDependency } from "./utils.ts";

export interface Black {
  hasBlack: boolean;
}

export const introspect: IntrospectFn<Black | null> = async (context) => {
  return {
    hasBlack: await hasDependency("black", context),
  };
};
