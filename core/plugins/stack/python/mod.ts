import { Introspector } from "../../../types.ts";
import { introspect as introspectVersion } from "./version.ts";
import { introspect as introspectPytest } from "./pytest.ts";
import {
  introspect as introspectPackageManager,
  PackageManager,
} from "./packageManager.ts";
import {
  Frameworks,
  introspect as introspectFrameworks,
} from "./frameworks.ts";
import { introspect as introspectLinters, Linters } from "./linters.ts";
import {
  Formatters,
  introspect as introspectFormatters,
} from "./formatters.ts";
import { introspect as introspectType } from "./type.ts";

/**
 * Introspected information about a project with Python
 */
export default interface PythonProject {
  /**
   * Python version
   */
  version?: string;
  /**
   * Identified type of project
   */
  type?: string | null;
  /**
   * If the project has pytest installed
   */
  hasPytest?: boolean;
  /**
   * List of possible project frameworks
   */
  frameworks?: Frameworks;
  /**
   * Which package manager is used in the project
   */
  packageManager?: PackageManager;
  /**
   * Which linter the project uses, if any
   */
  linters: Linters;
  /**
   * Which formatter the project uses, if any
   */
  formatters: Formatters;
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

    // Search python package manager and dependencies
    logger.debug("detecting the package manager");
    const packageManager = await introspectPackageManager(context);
    if (packageManager === undefined) {
      logger.debug("didn't detect any know python package manager");
    }

    // Search python frameworks
    logger.debug("detecting frameworks");
    const frameworks = await introspectFrameworks(context);
    if (frameworks === undefined) {
      logger.debug("didn't detect any know python framework");
    }
    // Pytest
    const hasPytest = await introspectPytest(context);

    // Linters and Formatters
    const linters = await introspectLinters(context);
    const formatters = await introspectFormatters(context);

    // Project type
    const projectType = await introspectType(context);

    return {
      version: version,
      frameworks: frameworks,
      packageManager: packageManager,
      formatters: formatters,
      linters: linters,
      type: projectType,
      hasPytest: hasPytest,
    };
  },
};
