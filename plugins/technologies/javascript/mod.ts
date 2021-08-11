import { Introspector } from "../deps.ts";
import { introspect as introspectRuntime, Runtime } from "./runtime.ts";
import {
  introspect as introspectPackageManager,
  PackageManager,
} from "./package_manager.ts";

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
  packageManager: PackageManager | null;
  /**
   * Which runtime the project uses
   */
  runtime: Runtime;
}

export const introspector: Introspector<JavaScriptProject> = {
  detect: async (context) => {
    return await context.helpers.hasAnyFile("**/*.[j|t]s");
  },
  introspect: async (context) => {
    const { logger } = context;

    // Runtime
    logger.debug("js: detecting runtime");
    const runtime = await introspectRuntime(context);
    logger.debug(`js: detected runtime "${runtime.name}"`);

    // Package manager
    let packageManager: PackageManager | null;
    if (runtime.name === "deno") {
      logger.debug(
        "js: skipping package manager detection, unapplicable for the detected runtime",
      );
      packageManager = null;
    } else {
      logger.debug("js: detecting package manager");
      packageManager = await introspectPackageManager(context);
      logger.debug(`js: detected package manager "${packageManager.name}"`);
    }

    return {
      runtime,
      packageManager,
    };
  },
};
