import {
  expandGlob,
  FileEntry,
  fileExists,
  parseToml,
  readLines as stdReadLines,
} from "../../deps.ts";

/**
 * Search for the .gitignore file and if it exists use the content
 * to exclude files or directories from the glob.
 */
async function loadGitignoreExcludes() {
  const excludedFiles: string[] = [];

  if (await fileExists(".gitignore")) {
    const text = await Deno.readTextFile(".gitignore");
    for await (const file of text.split("\n")) {
      if (
        file.includes("#") ||
        (file.includes("!") || (file.includes(" ") || (!file)))
      ) {
        continue;
      }
      excludedFiles.push(file);
    }
    return excludedFiles;
  }
  return [];
}

/**
 * Check if there is at least one file in the project that match the received
 * glob pattern
 */
export async function includes(glob: string): Promise<boolean> {
  return !(await expandGlob(glob, { exclude: await loadGitignoreExcludes() })
    .next()).done;
}

/**
 * Expand the glob string from the project root and yield each result.
 *
 * Return only files, not directories
 */
export async function* each(glob: string): AsyncIterableIterator<FileEntry> {
  for await (
    const file of expandGlob(glob, { exclude: await loadGitignoreExcludes() })
  ) {
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
 * Returns the serialized content from a JSON file
 */
export async function readJSON(path: string) {
  return JSON.parse(await Deno.readTextFile(path));
}

/**
 * Yields each line of a text file
 */
export async function* readLines(path: string): AsyncIterableIterator<string> {
  const fileReader = await Deno.open(path);
  for await (const line of stdReadLines(fileReader)) {
    yield line;
  }
  fileReader.close();
  return;
}

export async function readText(path: string): Promise<string> {
  return await Deno.readTextFile(path);
}
