import { assertEquals, assertStringIncludes } from "../deps.ts";
import {
  assertExpectedFiles,
  cleanGitHubFiles,
  output,
  test,
} from "./helpers.ts";

test(
  { fixture: "javascript/npm-no-deps", args: [] },
  async (proc) => {
    const [stdout, _stderr, { code }] = await output(proc);
    assertStringIncludes(stdout, "Detected stack: javascript");
    assertStringIncludes(stdout, "No JavaScript linter detected, using ESLint");
    assertStringIncludes(
      stdout,
      "No JavaScript formatter detected, using Prettier",
    );
    assertEquals(code, 0);
    await assertExpectedFiles("javascript/npm-no-deps");
    await cleanGitHubFiles("javascript/npm-no-deps");
  },
);

test(
  { fixture: "python/requirements-unknown-version", args: [] },
  async (proc) => {
    const [stdout, _stderr, { code }] = await output(proc);
    assertStringIncludes(stdout, "Detected stack: python");
    assertStringIncludes(
      stdout,
      "Didn't generate pipeline for every detected stack!",
    );
    assertStringIncludes(
      stdout,
      "Couldn't detect which Python version this project uses.",
    );
    assertStringIncludes(
      stdout,
      "If you don't want to change your project now, try again with the --no-strict flag.",
    );
    assertEquals(code, 3);
  },
);

test(
  { fixture: "python/requirements-unknown-version", args: ["--no-strict"] },
  async (proc) => {
    const [stdout, _stderr, { code }] = await output(proc);
    assertStringIncludes(stdout, "Detected stack: python");
    assertStringIncludes(
      stdout,
      "Couldn't detect the Python version, using the latest available: 3.10",
    );
    assertStringIncludes(
      stdout,
      "No linters for python were identified in the project, creating default pipeline with 'flake8' WITHOUT any specific configuration",
    );
    assertStringIncludes(
      stdout,
      "No linters for python were identified in the project, creating default pipeline with 'pylint' WITHOUT any specific configuration",
    );
    assertStringIncludes(
      stdout,
      "No formatters for python were identified in the project, creating default pipeline with 'black' WITHOUT any specific configuration",
    );
    assertEquals(code, 0);
    await assertExpectedFiles("python/requirements-unknown-version");
    await cleanGitHubFiles("python/requirements-unknown-version");
  },
);

test(
  { fixture: "python/requirements-black-and-pyproject", args: [] },
  async (proc) => {
    const [stdout, _stderr, { code }] = await output(proc);
    assertStringIncludes(stdout, "Detected stack: python");
    assertStringIncludes(
      stdout,
      "No linters for python were identified in the project, creating default pipeline with 'flake8' WITHOUT any specific configuration",
    );
    assertStringIncludes(
      stdout,
      "No linters for python were identified in the project, creating default pipeline with 'pylint' WITHOUT any specific configuration",
    );
    assertStringIncludes(
      stdout,
      "No formatters for python were identified in the project, creating default pipeline with 'isort' WITHOUT any specific configuration",
    );
    assertEquals(code, 0);
    await assertExpectedFiles("python/requirements-black-and-pyproject");
    await cleanGitHubFiles("python/requirements-black-and-pyproject");
  },
);

test(
  { fixture: "python/setup-flake8", args: ["--no-strict"] },
  async (proc) => {
    const [stdout, _stderr, { code }] = await output(proc);
    assertStringIncludes(stdout, "Detected stack: python");
    assertStringIncludes(
      stdout,
      "Couldn't detect the Python version, using the latest available: 3.10",
    );
    assertStringIncludes(
      stdout,
      "No linters for python were identified in the project, creating default pipeline with 'flake8' WITHOUT any specific configuration",
    );
    assertStringIncludes(
      stdout,
      "No linters for python were identified in the project, creating default pipeline with 'pylint' WITHOUT any specific configuration",
    );
    assertStringIncludes(
      stdout,
      "No formatters for python were identified in the project, creating default pipeline with 'black' WITHOUT any specific configuration",
    );
    assertStringIncludes(
      stdout,
      "No formatters for python were identified in the project, creating default pipeline with 'isort' WITHOUT any specific configuration",
    );
    assertEquals(code, 0);
    await assertExpectedFiles("python/setup-flake8");
    await cleanGitHubFiles("python/setup-flake8");
  },
);

test(
  { fixture: "python/setup-flake8", args: ["--no-strict"] },
  async (proc) => {
    const [stdout, _stderr, { code }] = await output(proc);
    assertStringIncludes(stdout, "Detected stack: python");
    assertStringIncludes(
      stdout,
      "Couldn't detect the Python version, using the latest available: 3.10",
    );
    assertStringIncludes(
      stdout,
      "No linters for python were identified in the project, creating default pipeline with 'flake8' WITHOUT any specific configuration",
    );
    assertStringIncludes(
      stdout,
      "No linters for python were identified in the project, creating default pipeline with 'pylint' WITHOUT any specific configuration",
    );
    assertStringIncludes(
      stdout,
      "No formatters for python were identified in the project, creating default pipeline with 'black' WITHOUT any specific configuration",
    );
    assertStringIncludes(
      stdout,
      "No formatters for python were identified in the project, creating default pipeline with 'isort' WITHOUT any specific configuration",
    );
    assertEquals(code, 0);
    await assertExpectedFiles("python/setup-flake8");
    await cleanGitHubFiles("python/setup-flake8");
  },
);

test(
  { fixture: "ruby/rubocop-lint", args: ["--no-strict"] },
  async (proc) => {
    const [stdout, _stderr, { code }] = await output(proc);
    assertStringIncludes(stdout, "Detected stack: ruby");
    assertEquals(code, 0);
    await assertExpectedFiles("ruby/rubocop-lint");
    await cleanGitHubFiles("ruby/rubocop-lint");
  },
);
