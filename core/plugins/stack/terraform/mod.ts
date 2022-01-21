import { Introspector } from "../../../types.ts";
import {
  introspect as introspectVersion,
  TerraformVersion,
} from "./version.ts";

export default interface TerraformProject {
  version?: TerraformVersion;
}

export const introspector: Introspector<TerraformProject | undefined> = {
  detect: async (context) => {
    return await context.files.includes("**/*.tf");
  },
  introspect: async (context) => {
    const logger = await context.getLogger("terraform");

    //Version
    logger.debug("detecting version");
    const version = await introspectVersion(context);
    if (version === undefined) {
      logger.debug("didn't detect the version");
      return undefined;
    }
    logger.debug(`detected version ${version}`);

    return {
      version: version,
    };
  },
};
