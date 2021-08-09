import { expandGlob, WalkEntry } from "../../deps.ts";
export { readLines } from "../../deps.ts";

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
