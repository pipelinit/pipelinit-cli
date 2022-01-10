import { assertEquals, assertStringIncludes } from "../../cli/deps.ts";
import { test } from "../helpers.ts";

test(
  { fixture: "docker/docker-lint-build", args: ["--no-strict"] },
  async (stdout, _stderr, code, assertExpectedFiles) => {
    assertStringIncludes(stdout, "Detected stack: docker");
    assertEquals(code, 0);
    await assertExpectedFiles();
  },
);
