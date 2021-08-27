import { Introspector } from "../deps.ts";
import { introspect as introspectVersion } from "./version.ts";
import { introspect as instrospectLinter, Linters } from "./linters.ts";
import {
  Formatters,
  introspect as instrospectFormatter,
} from "./formatters.ts";
import { introspect as instrospectTester, Testers } from "./testers.ts";
import {
  introspect as introspectPackageManager,
  PackageManager,
} from "./package_manager.ts";

// Available package managers
type PythonPackageManager = PackageManager | null;
/**
 * Introspected information about a project with Python
 */
export default interface PythonProject {
  version?: string;
  packageManager: PythonPackageManager;
  linters: Linters | null;
  formatters: Formatters | null;
  testers: Testers | null;
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
    // Package Manager
    logger.debug("detecting package manager");
    const packageManager = await introspectPackageManager(context);
    // Formatter
    const formatters = await instrospectFormatter(context);
    // Tester
    const testers = await instrospectTester(context);
    // Linter
    const linters = await instrospectLinter(context);
    return {
      version,
      packageManager,
      linters,
      formatters,
      testers,
    };
  },
};
