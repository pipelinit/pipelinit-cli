import { assert, assertEquals, fileExists, walk } from "../deps.ts";

const path = (relative: string) =>
  (new URL(relative, import.meta.url))
    .toString()
    .replace("file://", "");

const entrypointUrl = path("../pipelinit.ts");
const rootUrl = path("../..");

/**
 * Executes pipelinit against a target fixture project
 */
export function pipelinit(
  args: string[],
  fixture?: string,
): Deno.Process {
  const cwd = (typeof fixture === "string")
    ? path(`./fixtures/${fixture}/project`)
    : rootUrl;
  console.log(rootUrl);
  const cmd = [
    "deno",
    "run",
    "--no-check",
    `--allow-read=.,${rootUrl}`,
    "--allow-write=.",
    entrypointUrl,
    ...args,
  ];
  return Deno.run({
    cmd,
    cwd,
    stdin: "null",
    stdout: "piped",
    stderr: "piped",
  });
}

export interface TestOptions {
  args: string[];
  fixture?: string;
}

/**
 * Runs acceptance tests for the CLI
 */
export function test(
  opts: TestOptions,
  fn: (proc: Deno.Process) => void | Promise<void>,
) {
  const prefix = `pipelinit ${opts.fixture || ""}`.trim();
  const name = [prefix, ...opts.args].join(" ");
  Deno.test(name, async () => {
    const proc = pipelinit(opts.args, opts.fixture);
    try {
      await fn(proc);
    } finally {
      proc.close();
    }
  });
}

export async function output(
  proc: Deno.Process,
): Promise<[string, string, Deno.ProcessStatus]> {
  const [status, stdout, stderr] = await Promise.all([
    proc.status(),
    proc.output(),
    proc.stderrOutput(),
  ]);
  return [
    new TextDecoder().decode(stdout),
    new TextDecoder().decode(stderr),
    status,
  ];
}

export async function assertExpectedFiles(fixture: string) {
  const expectedDir = path(`./fixtures/${fixture}/expected/`);

  for await (const entry of walk(expectedDir)) {
    if (!entry.isFile) continue;

    const expected = entry.path;
    const [_, relativePath] = entry.path.split(expectedDir);
    const generated = path(`./fixtures/${fixture}/project/${relativePath}`);
    assert(await fileExists(generated), `didn't generate ${generated}`);
    const generatedContent = await Deno.readTextFile(generated);
    const expectedContent = await Deno.readTextFile(expected);
    assertEquals(generatedContent, expectedContent);
  }
}

// FIXME
// Generalize this to clean files generated while the CLI was
// running against a fixture project
export async function cleanGitHubFiles(fixture: string) {
  await Deno.remove(path(`./fixtures/${fixture}/project/.github`), {
    recursive: true,
  });
}
