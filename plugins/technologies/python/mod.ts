import { Introspector } from "../deps.ts";

/**
 * Introspected information about a project with Python
 */
export default interface PythonProject {
  /**
   * Python version
   */
  version: string;
}

export const introspector: Introspector<PythonProject> = {
  detect: async (context) => {
    return await context.helpers.hasAnyFile("**/*.py");
  },
  introspect: async (context) => {
    return {
      version: "3.9",
    };
  },
};
