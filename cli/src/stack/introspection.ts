import { introspectors, log, ProjectData } from "../../deps.ts";
import { context } from "../plugin/mod.ts";

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

type Maybe<T> = T | undefined;

// Type predicate to filter undefined values
function isDefined<T>(v: Maybe<T>): v is T {
  return v !== undefined;
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
  if (stackNames.length === 0) {
    logger.warning("No stack detected!");
  } else {
    logger.info(`Detected stack: ${stackNames}`);
  }

  const introspected = (await Promise.all(
    stack.map<Promise<Maybe<ProjectData>>>((introspector) =>
      introspector.introspect(context)
    ),
  ));

  const data = stack
    .reduce((obj, introspector, i) => {
      const data = introspected[i];
      if (isDefined(data)) {
        obj[introspector.name] = data;
      }
      return obj;
    }, {} as Stack);

  logger.debug(`Introspected data: ${JSON.stringify(data)}`);

  return data;
}
