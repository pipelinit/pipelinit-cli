import { Introspector } from "../../../types.ts";
import { Formatters, introspect as introspectFormatter } from "./formatters.ts";
import { introspect as introspectLinter, Linters } from "./linters.ts";
import {
  introspect as introspectPackageManager,
  NodePackageManager,
} from "../_shared/node_package_manager/mod.ts";

// Available package managers
type PackageManager = NodePackageManager | null;

/**
 * Introspected information about a project with JavaScript
 */
export default interface CssProject {
  /**
   * Which package manager is used in the project
   */
  packageManager?: PackageManager;
  /**
   * Which formatter the project uses, if any
   */
  formatters: Formatters;
  /**
   * Which linter the project uses, if any
   */
  linters: Linters;
}

export const introspector: Introspector<CssProject> = {
  detect: async (context) => {
    return await context.files.includes("**/*.{c,sc,sa,le}ss");
  },
  introspect: async (context) => {
    const logger = context.getLogger("css");

    // Package manager
    logger.debug("detecting package manager");
    const packageManager = await introspectPackageManager(context);
    logger.debug(`detected package manager "${packageManager.name}"`);

    // Formatter
    const formatters = await introspectFormatter(context);
    const linters = await introspectLinter(context);

    return {
      packageManager,
      formatters,
      linters,
    };
  },
};
