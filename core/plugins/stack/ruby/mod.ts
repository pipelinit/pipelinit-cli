import { Introspector } from "../../../types.ts";
import { introspect as introspectVersion } from "./version.ts";
import { introspect as introspectLinters, Linters } from "./linters.ts";
import {
  Formatters,
  introspect as introspectFormatters,
} from "./formatters.ts";

/**
 * Introspected information about a project with Ruby
 */
export default interface RubyProject {
  /**
   * Ruby version
   */
  version?: string;
  /**
   * Which linter the project uses, if any
   */
  linters: Linters;
  formatters: Formatters;
}

export const introspector: Introspector<RubyProject | undefined> = {
  detect: async (context) => {
    return await context.files.includes("**/*.rb");
  },
  introspect: async (context) => {
    const logger = context.getLogger("ruby");
    logger.info("Detected Ruby File");

    // Version
    logger.debug("detecting version");
    const version = await introspectVersion(context);
    if (version === undefined) {
      logger.debug("didn't detect the version");
      return undefined;
    }
    logger.debug(`detected version ${version}`);

    // Linters and Formatters
    const linters = await introspectLinters(context);
    const formatters = await introspectFormatters(context);

    return {
      version: version,
      linters: linters,
      formatters: formatters,
    };
  },
};
