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
    const runtime = await introspectRuntime(context);
    const packageManager = runtime.name === "deno"
      ? null
      : await introspectPackageManager(context);

    return {
      runtime,
      packageManager,
    };
  },
};
