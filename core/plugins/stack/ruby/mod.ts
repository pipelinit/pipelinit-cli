import { Introspector } from "../../../types.ts";
import { introspect as introspectVersion } from "./version.ts";
import { introspect as introspectLinters, Linters } from "./linters.ts";
import {
  Formatters,
  introspect as introspectFormatters,
} from "./formatters.ts";
import { introspect as introspectType } from "./types.ts";

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
  /**
   * Identified type of project
   */
  type?: string | null;
}

export const introspector: Introspector<RubyProject | undefined> = {
  detect: async (context) => {
    return await context.files.includes("**/*.rb");
  },
  introspect: async (context) => {
    const logger = context.getLogger("ruby");

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

    //Project type
    const projectType = await introspectType(context);

    return {
      version: version,
      linters: linters,
      formatters: formatters,
      type: projectType,
    };
  },
};
