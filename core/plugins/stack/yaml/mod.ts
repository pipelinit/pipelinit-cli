import { Introspector } from "../../../types.ts";
import { Formatters, introspect as introspectFormatter } from "./formatters.ts";

/**
 * Introspected information about a project with Yaml
 */
export default interface YamlProject {
  /**
   * Which formatter the project uses, if any
   */
  formatters: Formatters;
}

export const introspector: Introspector<YamlProject> = {
  detect: async (context) => {
    return await context.files.includes("**/*.{y,ya}ml");
  },
  introspect: async (context) => {
    const formatters = await introspectFormatter(context);

    return {
      formatters: formatters,
    };
  },
};
