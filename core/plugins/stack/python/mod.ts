import { Introspector } from "../../../types.ts";
import { introspect as introspectVersion } from "./version.ts";
import {
  Frameworks,
  introspect as introspectFrameworks,
} from "./frameworks.ts";

/**
 * Introspected information about a project with Python
 */
export default interface PythonProject {
  /**
   * Python version
   */
  version?: string;
  /**
   * List of possible project frameworks
   */
  frameworks?: Frameworks;
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

    // Search python frameworks
    logger.debug("detecting frameworks");
    const frameworks = await introspectFrameworks(context);
    if (frameworks === undefined) {
      logger.debug("didn't detect any know python framework");
    }

    return {
      version: version,
      frameworks: frameworks,
    };
  },
};
