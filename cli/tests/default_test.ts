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
