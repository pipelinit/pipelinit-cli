import { assertEquals, assertStringIncludes } from "../cli/deps.ts";
import { test } from "./helpers.ts";

test(
  { fixture: "ruby/rubocop-lint", args: ["--no-strict"] },
  async (stdout, _stderr, code, assertExpectedFiles) => {
    assertStringIncludes(stdout, "Detected stack: markdown, ruby");
    assertEquals(code, 0);
    await assertExpectedFiles();
  },
);

test(
  { fixture: "ruby/sinatra", args: ["--no-strict"] },
  async (stdout, _stderr, code, assertExpectedFiles) => {
    assertStringIncludes(stdout, "Detected stack: ruby");
    assertEquals(code, 0);
    await assertExpectedFiles();
  },
);
