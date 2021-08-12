import { expandGlob, parseToml, Select, WalkEntry } from "../../../deps.ts";
export { readLines } from "../../../deps.ts";

/**
 * Check if there are any files in the project that match
 * the received glob pattern
 */
export async function hasAnyFile(glob: string): Promise<boolean> {
  return !(await expandGlob(glob).next()).done;
}

/**
 * Expand the glob string from the project root and yield each result.
 *
 * Return only files, not directories
 */
export async function* files(glob: string): AsyncIterableIterator<WalkEntry> {
  for await (const file of expandGlob(glob)) {
    if (!file.isFile) {
      continue;
    }
    yield file;
  }
  return;
}

/**
 * Returns the serialized content from a TOML file
 */
export async function readToml(path: string) {
  // FIXME how to easily handle typing here without pushing the
  // job towards the plugin code?
  //
  // deno-lint-ignore no-explicit-any
  return parseToml(await Deno.readTextFile(path)) as any;
}

/**
 * Ask the user to pick one option from a list
 */
export async function askOption(question: string, options: string[]) {
  return await Select.prompt({ message: question, options });
}
