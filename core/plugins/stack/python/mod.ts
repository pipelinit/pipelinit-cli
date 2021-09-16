import { Introspector } from "../../../types.ts";
import { introspect as introspectVersion } from "./version.ts";
import { introspect as introspectDjango } from "./django.ts";

/**
 * Introspected information about a project with Python
 */
export default interface PythonProject {
  /**
   * Python version
   */
  version?: string;
  /**
   * If is a Django project
   */
  isDjango?: boolean;
}

export const introspector: Introspector<PythonProject | undefined> = {
  detect: async (context) => {
    return await context.files.includes("**/*.py");
  },
  introspect: async (context) => {
    const logger = context.getLogger("python");

    // Version
    logger.debug("detecting version");
    const version = await introspectVersion(context);
    if (version === undefined) {
      logger.debug("didn't detect the version");
      return undefined;
    }
    logger.debug(`detected version ${version}`);

    // Django
    const django = await introspectDjango(context);
    if (django) {
      logger.debug("detected Django project");
    }
    return {
      version: version,
      isDjango: django,
    };
  },
};
