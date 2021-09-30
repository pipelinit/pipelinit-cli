import { IntrospectFn } from "../../../types.ts";
import { hasPythonDependency } from "./dependencies.ts";

export const introspect: IntrospectFn<boolean> = async (context) => {
  // Search for the Pytest dependency
  return await hasPythonDependency(context, "pytest");
};
