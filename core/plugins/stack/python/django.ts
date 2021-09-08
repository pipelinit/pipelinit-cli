import { IntrospectFn } from "../deps.ts";

export const introspect: IntrospectFn<boolean> = async (context) => {
  // Search for project manage.py to define as a Django project
  for await (const _file of context.files.each("**/manage.py")) {
    return true;
  }
  return false;
};
