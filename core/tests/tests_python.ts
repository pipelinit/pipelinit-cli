import { assertEquals, assertStringIncludes } from "../cli/deps.ts";
import { test } from "./helpers.ts";

test(
  { fixture: "python/requirements-unknown-version", args: [] },
  (stdout, _stderr, code, _assertExpectedFiles) => {
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
  async (stdout, _stderr, code, assertExpectedFiles) => {
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
      "No formatters for python were identified in the project, creating default pipeline with 'black' WITHOUT any specific configuration",
    );
    assertEquals(code, 0);
    await assertExpectedFiles();
  },
);

test(
  { fixture: "python/requirements-black-and-pyproject", args: [] },
  async (stdout, _stderr, code, assertExpectedFiles) => {
    assertStringIncludes(stdout, "Detected stack: python");
    assertStringIncludes(
      stdout,
      "No linters for python were identified in the project, creating default pipeline with 'flake8' WITHOUT any specific configuration",
    );
    assertStringIncludes(
      stdout,
      "No formatters for python were identified in the project, creating default pipeline with 'isort' WITHOUT any specific configuration",
    );
    assertEquals(code, 0);
    await assertExpectedFiles();
  },
);

test(
  { fixture: "python/setup-flake8", args: ["--no-strict"] },
  async (stdout, _stderr, code, assertExpectedFiles) => {
    assertStringIncludes(stdout, "Detected stack: python");

    assertStringIncludes(
      stdout,
      "No linters for python were identified in the project, creating default pipeline with 'flake8' WITHOUT any specific configuration",
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
    await assertExpectedFiles();
  },
);

test(
  { fixture: "python/python-django", args: ["--no-strict"] },
  async (stdout, _stderr, code, assertExpectedFiles) => {
    assertStringIncludes(stdout, "Detected stack: markdown, python, shell");
    assertStringIncludes(
      stdout,
      "No formatters for python were identified in the project, creating default pipeline with 'black' WITHOUT any specific configuration",
    );
    assertEquals(code, 0);
    await assertExpectedFiles();
  },
);

test(
  { fixture: "python/python-django-gitlab", args: ["--no-strict"] },
  async (_stdout, _stderr, code, assertExpectedFiles) => {
    assertEquals(code, 0);
    await assertExpectedFiles();
  },
);