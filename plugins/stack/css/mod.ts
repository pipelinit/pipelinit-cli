import { Introspector } from "../deps.ts";
import {
  introspect as introspectFormatter,
  Prettier,
} from "../_shared/prettier/mod.ts";
import {
  introspect as introspectLinter,
  Stylelint,
} from "../_shared/stylelint/mod.ts";
import {
  introspect as introspectPackageManager,
  NodePackageManager,
} from "../_shared/node_package_manager/mod.ts";

// Available package managers
type PackageManager = NodePackageManager | null;
// Available code formatters
type Formatter = Prettier | null;
// Available linters
type Linter = Stylelint | null;

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
  formatter?: Formatter;
  /**
   * Which linter the project uses, if any
   */
  linter?: Linter;
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
    logger.debug("detecting formatter");
    const formatter = await introspectFormatter(context);
    if (formatter !== null) {
      logger.debug(`detected formatter "${formatter.name}"`);
    } else {
      logger.debug("no supported formatter detected");
    }

    // Linter
    logger.debug("detecting linter");
    const linter = await introspectLinter(context);
    if (linter !== null) {
      logger.debug(`detected linter "${linter.name}"`);
    } else {
      logger.debug("no supported linter detected");
    }

    return {
      packageManager,
      formatter,
      linter,
    };
  },
};
