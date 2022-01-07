import { assertEquals, assertStringIncludes } from "../cli/deps.ts";
import { test } from "./helpers.ts";

test(
  { fixture: "java/java-build-gradle", args: ["--no-strict"] },
  async (stdout, _stderr, code, assertExpectedFiles) => {
    assertStringIncludes(stdout, "Detected stack: java");
    assertEquals(code, 0);
    await assertExpectedFiles();
  },
);
