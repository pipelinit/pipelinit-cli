import { assertEquals, assertStringIncludes } from "../../cli/deps.ts";
import { test } from "../helpers.ts";

test(
  { fixture: "yaml/yaml-project", args: [] },
  async (stdout, _stderr, code, assertExpectedFiles) => {
    assertStringIncludes(stdout, "Detected stack: yaml");
    assertStringIncludes(
      stdout,
      "No Yaml formatter detected, using Prettier",
    );
    assertEquals(code, 0);
    await assertExpectedFiles();
  },
);
