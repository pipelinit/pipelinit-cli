import { Introspector } from "../../../types.ts";
import { introspect as introspectLinters, Linters } from "./linters.ts";

/**
 * Introspected information about a project with ShellScript
 */
export default interface ShellProject {
  /**
   * Which linter the project uses, if any
   */
  linters?: Linters;
}

function anyValue(records: Record<string, unknown>): boolean {
  return Object.values(records).some((v) => v);
}

export const introspector: Introspector<ShellProject> = {
  detect: async (context) => {
    return await context.files.includes("**/*.{sh,bash}");
  },
  introspect: async (context) => {
    const logger = context.getLogger("shell");

    logger.debug("detecting linters");
    const linters = await introspectLinters(context);

    if (!anyValue(linters)) {
      logger.debug("didn't detect any know shell linter");

      if (context.suggestDefault) {
        logger.warning("Using ShellCheck as the default shell linter ");
        return {
          linters: { shellCheck: {} },
        };
      }
    }

    return {
      linters: linters,
    };
  },
};
