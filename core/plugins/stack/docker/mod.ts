import { Introspector } from "../../../types.ts";

/**
 * Introspected information about a project with Docker
 */
export default interface DockerProject {
  hasDockerImage: true;
}

export const introspector: Introspector<DockerProject> = {
  detect: async (context) => {
    return await context.files.includes("**/Dockerfile");
  },
  introspect: async (context) => {
    const logger = await context.getLogger("docker");
    logger.debug("detected docker image");

    return { hasDockerImage: true };
  },
};
