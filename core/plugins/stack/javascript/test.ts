import { IntrospectFn } from "../../../types.ts";

export const introspect: IntrospectFn<boolean> = async (context) => {
  for await (const file of context.files.each("./package.json")) {
    const packageJson = await context.files.readJSON(file.path);
    if (packageJson?.scripts?.test) {
      const testCommand = packageJson.scripts.test;
      if (testCommand) {
        return true;
      }
    }
  }
  return false;
};
