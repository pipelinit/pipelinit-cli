import { assertEquals } from "../cli/deps.ts";
import { test } from "./helpers.ts";

test({ args: ["--version"] }, (stdout, _stderr, code, _assertExpectedFiles) => {
  assertEquals(stdout, "0.2.2");
  assertEquals(code, 0);
});
