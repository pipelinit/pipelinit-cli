import { IntrospectFn } from "../../../types.ts";
import { hasPythonDependency } from "./dependencies.ts";

export const introspect: IntrospectFn<boolean> = async (context) => {
  // Search for the Django dependency to define as a Django project
  return await hasPythonDependency(context, "django");
};
