import { assertEquals, assertStringIncludes } from "../deps.ts";
import { output, test } from "./helpers.ts";

test(
  { args: ["--help"] },
  async (proc) => {
    const [stdout, _stderr, { code }] = await output(proc);
    assertStringIncludes(stdout, "--help");
    assertStringIncludes(stdout, "--version");
    assertStringIncludes(stdout, "--debug");
    assertStringIncludes(stdout, "--no-default-stage");
    assertEquals(code, 0);
  },
);
