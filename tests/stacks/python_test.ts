import { assertEquals, assertStringIncludes } from "../../cli/deps.ts";
import { test } from "../helpers.ts";

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
      "Couldn't detect the Python version, using the latest available",
    );
    assertStringIncludes(
      stdout,
      "No Python linter detected, using Flake8",
    );
    assertStringIncludes(
      stdout,
      "No Python formatter detected, using Black",
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
      "No Python linter detected, using Flake8",
    );
    assertStringIncludes(
      stdout,
      "No Python linter detected, using isort",
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
      "No Python linter detected, using Flake8",
    );
    assertStringIncludes(
      stdout,
      "No Python formatter detected, using Black",
    );
    assertStringIncludes(
      stdout,
      "No Python linter detected, using isort",
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
      "No Python formatter detected, using Black",
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

test(
  { fixture: "python/python-pipenv", args: ["--no-strict"] },
  async (stdout, _stderr, code, assertExpectedFiles) => {
    assertStringIncludes(stdout, "Detected stack: python");
    assertStringIncludes(
      stdout,
      "No Python formatter detected, using Black",
    );
    assertEquals(code, 0);
    await assertExpectedFiles();
  },
);

const releaseWarn = `
Creating a release Pipelinit. Make sure to create the following secrets generated on the workflow:
  REGISTRY_USERNAME -> Registry username
  REGISTRY_PASSWORD -> Registry password
  REGISTRY_ORGANIZATION -> Registry project organization
`;

test(
  { fixture: "docker/release-docker", args: ["--no-strict"] },
  async (stdout, _stderr, code, assertExpectedFiles) => {
    assertStringIncludes(stdout, "Detected stack: docker");
    assertStringIncludes(stdout, "Found docker image on root");
    assertStringIncludes(stdout, releaseWarn);
    assertEquals(code, 0);
    await assertExpectedFiles();
  },
);

test(
  { fixture: "docker/release-github", args: ["--no-strict"] },
  async (stdout, _stderr, code, assertExpectedFiles) => {
    assertStringIncludes(stdout, "Detected stack: docker");
    assertStringIncludes(stdout, "Found docker image on root");
    assertStringIncludes(stdout, releaseWarn);
    assertEquals(code, 0);
    await assertExpectedFiles();
  },
);
