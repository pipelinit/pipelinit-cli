import { IntrospectFn } from "../../../types.ts";

export const introspect: IntrospectFn<boolean> = async (context) => {
  // Search for any .vue file
  return await context.files.includes("**/*.vue");
};
