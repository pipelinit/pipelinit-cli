import { assertEquals } from "../deps.ts";
import { output, test } from "./helpers.ts";

test({ args: ["--version"] }, async (proc) => {
  const [stdout, _stderr, { code }] = await output(proc);
  assertEquals(stdout, "0.1.0");
  assertEquals(code, 0);
});
