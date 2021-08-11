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
    const { logger } = context;

    // Version
    logger.debug("py: detecting version");
    const version = "3.9";
    logger.debug(`py: detected version ${version}`);
    return {
      version: version,
    };
  },
};
