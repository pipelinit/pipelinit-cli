import { Introspector } from "../../../types.ts";

/**
 * Introspected information about a project with Docker
 */
export default interface JavaProject {
  isGradleProject: true;
}

export const introspector: Introspector<JavaProject> = {
  detect: async (context) => {
    return await context.files.includes("**/build.gradle");
  },
  introspect: async (context) => {
    const logger = await context.getLogger("java");
    logger.debug("detected gradle project");

    return { isGradleProject: true };
  },
};
