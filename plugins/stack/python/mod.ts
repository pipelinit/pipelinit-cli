import { Introspector } from "../deps.ts";
import { introspect as introspectVersion } from "./version.ts";

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
    return await context.files.includes("**/*.py");
  },
  introspect: async (context) => {
    const logger = context.getLogger("python");

    // Version
    logger.debug("detecting version");
    const version = await introspectVersion(context);
    logger.debug(`detected version ${version}`);
    return {
      version: version,
    };
  },
};
