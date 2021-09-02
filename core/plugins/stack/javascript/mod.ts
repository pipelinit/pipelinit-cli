import { Introspector } from "../../../types.ts";
import { Formatters, introspect as introspectFormatter } from "./formatters.ts";
import { introspect as introspectLinter, Linters } from "./linters.ts";
import { introspect as introspectRuntime, Runtime } from "./runtime.ts";
import {
  introspect as introspectPackageManager,
  NodePackageManager,
} from "../_shared/node_package_manager/mod.ts";

// Available package managers
type PackageManager = NodePackageManager | null;

/**
 * Introspected information about a project with JavaScript
 */
export default interface JavaScriptProject {
  /**
   * Which package manager is used in the project
   *
   * A package manager may not exist in a JavaScript project.
   * For example, a project that uses Deno doesn't need to use
   * npm, yarn or any other package manager.
   */
  packageManager?: PackageManager;
  /**
   * Which runtime the project uses
   */
  runtime: Runtime;
  /**
   * Which linter the project uses, if any
   */
  linters: Linters;
  /**
   * Which formatter the project uses, if any
   */
  formatters: Formatters;
}

export const introspector: Introspector<JavaScriptProject> = {
  detect: async (context) => {
    return await context.files.includes("**/*.[j|t]s");
  },
  introspect: async (context) => {
    const logger = context.getLogger("javascript");

    // Runtime
    logger.debug("detecting runtime");
    const runtime = await introspectRuntime(context);
    logger.debug(`detected runtime "${runtime.name}"`);
    if (runtime.name === "deno") {
      return {
        runtime,
        linters: {
          deno: {},
        },
        formatters: {
          deno: {},
        },
      };
    }

    // Package manager
    logger.debug("detecting package manager");
    const packageManager = await introspectPackageManager(context);
    logger.debug(`detected package manager "${packageManager.name}"`);

    // Linter and Formatter
    const linters = await introspectLinter(context);
    const formatters = await introspectFormatter(context);

    return {
      runtime,
      packageManager,
      linters,
      formatters,
    };
  },
};
