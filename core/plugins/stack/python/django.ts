import { IntrospectFn } from "../../../types.ts";

export const introspect: IntrospectFn<boolean> = async (context) => {
  // Search for the Django dependency to define as a Django project
  return await context.dependencies.includes("django");
};
