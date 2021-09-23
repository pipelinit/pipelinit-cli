import { IntrospectFn } from "../../../types.ts";

export const introspect: IntrospectFn<boolean> = async (context) => {
  // Search for project .shellcheckrc
  return await context.files.includes("**/.shellcheckrc");
};
