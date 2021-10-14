import { Introspector } from "../../../types.ts";
import { introspect as introspectRegistries, Registries } from "./registry.ts";
import {
  DockerContext,
  introspect as introspectDockerContext,
} from "./contextPaths.ts";

/**
 * Introspected information about a project with Docker
 */
export default interface DockerProject {
  hasDockerImage: true;
  registries: Registries;
  dockerContext: DockerContext;
}

const registryWarn = `
Creating a release Pipelinit. Make sure to create the following secrets generated on the workflow:
  REGISTRY_USERNAME -> Registry username
  REGISTRY_PASSWORD -> Registry password
  REGISTRY_ORGANIZATION -> Registry project organization
`;

export const introspector: Introspector<DockerProject> = {
  detect: async (context) => {
    return await context.files.includes("**/Dockerfile");
  },
  introspect: async (context) => {
    const logger = await context.getLogger("docker");
    logger.info("Found docker image on root");

    const registries = await introspectRegistries(context);
    const dockerContext = await introspectDockerContext(context);
    logger.info(registryWarn);

    return {
      hasDockerImage: true,
      registries: registries,
      dockerContext: dockerContext,
    };
  },
};
