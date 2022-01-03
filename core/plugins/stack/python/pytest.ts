import { IntrospectFn } from "../../../types.ts";

export const introspect: IntrospectFn<boolean> = async (context) => {
  // Search for the Pytest dependency
  return await context.dependencies.includes("pytest");
};
