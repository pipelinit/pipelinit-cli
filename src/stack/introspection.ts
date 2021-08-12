import { log } from "../../deps.ts";
import { context } from "../plugin/mod.ts";
import { introspectors, ProjectData } from "../../plugins/stack/mod.ts";

export type Stack = Record<string, ProjectData>;

/**
 * Run the detect function for each introspector and filter
 * the ones which detected the stack in the analyzed project.
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
 * Introspect each stack detected in the project and returns an object
 * with the stack as a key and the introspected data as the value
 *
 * Example:
 * ```ts
 * { javascript: { runtime: { name: "deno" }, packageManager: null } }
 * ```
 */
export async function introspect() {
  const logger = log.getLogger("main");

  logger.info("Detecting stack...");
  const stack = await detected();
  const stackNames = stack.map((t) => t.name).sort().join(", ");
  logger.info(`Detected stack: ${stackNames}`);

  const introspected = await Promise.all(
    stack.map<Promise<ProjectData>>((introspector) =>
      introspector.introspect(context)
    ),
  );

  return stack
    .reduce((obj, introspector, i) => {
      obj[introspector.name] = introspected[i];
      return obj;
    }, {} as Stack);
}
