import { assertEquals, assertStringIncludes } from "../../cli/deps.ts";
import { test } from "../helpers.ts";

test(
  { fixture: "terraform/terraform-project", args: [] },
  async (stdout, _stderr, code, assertExpectedFiles) => {
    assertStringIncludes(stdout, "Detected stack: markdown, terraform");
    assertEquals(code, 0);
    await assertExpectedFiles();
  },
);
