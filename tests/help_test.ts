import { assertEquals, assertStringIncludes } from "../cli/deps.ts";
import { test } from "./helpers.ts";

test(
  { args: ["--help"] },
  (stdout, _stderr, code, _assertExpectedFiles) => {
    assertStringIncludes(stdout, "--help");
    assertStringIncludes(stdout, "--version");
    assertStringIncludes(stdout, "--debug");
    assertStringIncludes(stdout, "--no-default-stage");
    assertEquals(code, 0);
  },
);
