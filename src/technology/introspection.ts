import { log } from "../../deps.ts";
import { context } from "./plugin.ts";
import { introspectors, ProjectData } from "../../plugins/technologies/mod.ts";

export type ProjectTechnology = Record<string, ProjectData>;

/**
 * Run the detect function for each introspector and filter
 * the ones which detected the technology in the analyzed project.
 *
 * Returns the relevant introspectors for the analyzed project
 */
async function detected() {
  const detected = await Promise.all(
    introspectors
      .map((introspector) => introspector.detect(context)),
  );
  return introspectors.filter((_, i) => detected[i]);
}

/**
 * Introspect each technology detected in the project and returns an object
 * with the technology as a key and the introspected data as the value
 *
 * Example:
 * ```ts
 * { javascript: { runtime: { name: "deno" }, packageManager: null } }
 * ```
 */
export async function introspect() {
  const logger = log.getLogger("main");

  logger.info("Detecting technologies...");
  const technologies = await detected();
  const technologyList = technologies.map((t) => t.name).sort().join(", ");
  logger.info(`Detected technologies: ${technologyList}`);

  const introspected = await Promise.all(
    technologies.map<Promise<ProjectData>>((introspector) =>
      introspector.introspect(context)
    ),
  );

  return technologies
    .reduce((obj, introspector, i) => {
      obj[introspector.name] = introspected[i];
      return obj;
    }, {} as ProjectTechnology);
}
