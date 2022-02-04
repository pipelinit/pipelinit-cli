import { assertEquals, assertStringIncludes } from "../../cli/deps.ts";
import { test } from "../helpers.ts";

test(
  { fixture: "javascript/vue-html", args: ["--no-strict"] },
  async (stdout, _stderr, code, assertExpectedFiles) => {
    assertStringIncludes(stdout, "Detected stack: html, javascript");
    assertStringIncludes(
      stdout,
      "No JavaScript formatter detected, using Prettier",
    );
    assertStringIncludes(
      stdout,
      "No Vue or Html formatter detected, using Prettier",
    );
    assertEquals(code, 0);
    await assertExpectedFiles();
  },
);

test(
  { fixture: "javascript/npm-no-deps", args: [] },
  async (stdout, _stderr, code, assertExpectedFiles) => {
    assertStringIncludes(stdout, "Detected stack: javascript");
    assertStringIncludes(stdout, "No JavaScript linter detected, using ESLint");
    assertStringIncludes(
      stdout,
      "No JavaScript formatter detected, using Prettier",
    );
    assertEquals(code, 0);
    await assertExpectedFiles();
  },
);

test(
  { fixture: "javascript/multiples-packages", args: [] },
  async (stdout, _stderr, code, assertExpectedFiles) => {
    assertStringIncludes(stdout, "Detected stack: javascript");
    assertEquals(code, 0);
    await assertExpectedFiles();
  },
);
