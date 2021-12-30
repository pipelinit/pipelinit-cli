import { assertEquals, parseToml, walk } from "../cli/deps.ts";
import { isConfig } from "../cli/src/lib/config.ts";

const path = (relative: string) =>
  (new URL(relative, import.meta.url))
    .toString()
    .replace("file://", "");

const entrypointUrl = path("../cli/pipelinit.ts");
const rootUrl = path("../");

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
  fn: (
    stdout: string,
    stderr: string,
    exitCode: number,
    macro: () => void,
  ) => void | Promise<void>,
) {
  const fixture = opts.fixture || "";
  const prefix = `pipelinit ${fixture}`.trim();
  const name = [prefix, ...opts.args].join(" ");
  Deno.test(name, async () => {
    const proc = pipelinit(opts.args, opts.fixture);
    const [stdout, stderr, { code }] = await output(proc);

    try {
      await fn(stdout, stderr, code, assertFunc(fixture));
    } finally {
      proc.close();
      if (
        code == 0 && !opts.args.includes("--version") &&
        !opts.args.includes("--help")
      ) {
        await cleanGitHubFiles(fixture);
      }
    }
  });
}

const assertFunc = (fixture: string) => {
  return async function assertExpectedFiles() {
    const expectedFiles: string[] = [];
    const generatedFiles: string[] = [];
    const projectConfig =
      `${Deno.cwd()}/tests/fixtures/${fixture}/project/.pipelinit.toml`;
    const configContent = parseToml(
      await Deno.readTextFile(projectConfig),
    );
    let generatedDir = path(
      `./fixtures/${fixture}/project/.github/workflows`,
    );
    if (isConfig(configContent)) {
      if (configContent.platforms?.includes("gitlab")) {
        generatedDir = path(
          `./fixtures/${fixture}/project/.gitlab-ci`,
        );
        for await (
          const entry of walk(path(`./fixtures/${fixture}/project/`))
        ) {
          if (!entry.isFile) continue;
          if (entry.name !== ".gitlab-ci.yml") continue;
          generatedFiles.push(entry.name);
        }
      }
    }

    const expectedDir = path(`./fixtures/${fixture}/expected/`);
    for await (const entry of walk(expectedDir)) {
      if (!entry.isFile) continue;
      expectedFiles.push(entry.name);
    }
    for await (const entry of walk(generatedDir)) {
      if (!entry.isFile) continue;
      generatedFiles.push(entry.name);
    }

    // First compare if the generated files are the expected in name and number
    assertEquals(expectedFiles.sort(), generatedFiles.sort());

    // Then compare the content of the expected and generated if they have the same names
    for await (const entry of walk(expectedDir)) {
      if (!entry.isFile) continue;
      const [_, relativePath] = entry.path.split(expectedDir);
      const generated = path(
        `./fixtures/${fixture}/project/${relativePath}`,
      );
      const generatedContent = await Deno.readTextFile(generated);
      const expectedContent = await Deno.readTextFile(entry.path);
      assertEquals(generatedContent, expectedContent);
    }
  };
};

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

// FIXME
// Generalize this to clean files generated while the CLI was
// running against a fixture project
export async function cleanGitHubFiles(fixture: string) {
  const projectConfig =
    `${Deno.cwd()}/tests/fixtures/${fixture}/project/.pipelinit.toml`;

  const configContent = parseToml(
    await Deno.readTextFile(projectConfig),
  );
  if (isConfig(configContent)) {
    if (configContent.platforms?.includes("gitlab")) {
      await Deno.remove(path(`./fixtures/${fixture}/project/.gitlab-ci`), {
        recursive: true,
      });
      await Deno.remove(path(`./fixtures/${fixture}/project/.gitlab-ci.yml`));
      return;
    }
  }
  await Deno.remove(path(`./fixtures/${fixture}/project/.github`), {
    recursive: true,
  });
}
