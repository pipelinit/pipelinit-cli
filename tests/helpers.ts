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

    if (isConfig(configContent) && configContent.platforms) {
      let generatedDir = "";
      for (const platform of configContent.platforms) {
        switch (platform) {
          case "github":
            generatedDir = `./fixtures/${fixture}/project/.github/workflows`;
            break;
          case "gitlab":
            generatedDir = `./fixtures/${fixture}/project/.gitlab-ci`;
            generatedFiles.push(".gitlab-ci.yml");
            break;
        }
        for await (const entry of walk(path(generatedDir))) {
          if (!entry.isFile) continue;
          generatedFiles.push(entry.name);
        }
      }
    }

    const expectedDir = path(`./fixtures/${fixture}/expected/`);
    for await (const entry of walk(expectedDir)) {
      if (!entry.isFile) continue;
      expectedFiles.push(entry.name);
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

  if (isConfig(configContent) && configContent.platforms) {
    for (const platform of configContent.platforms) {
      switch (platform) {
        case "github":
          await Deno.remove(path(`./fixtures/${fixture}/project/.github`), {
            recursive: true,
          });

          break;
        case "gitlab":
          await Deno.remove(path(`./fixtures/${fixture}/project/.gitlab-ci`), {
            recursive: true,
          });
          await Deno.remove(
            path(`./fixtures/${fixture}/project/.gitlab-ci.yml`),
          );
          break;
      }
    }
  }
}
