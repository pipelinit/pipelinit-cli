import { IntrospectFn } from "../../../types.ts";

export const introspect: IntrospectFn<boolean> = async (context) => {
  // Search for project manage.py to define as a Django project
  return await context.files.includes("**/manage.py");
};
