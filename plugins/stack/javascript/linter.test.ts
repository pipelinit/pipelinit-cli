import { context } from "../../../src/plugin/mod.ts";
import { assertEquals, deepMerge } from "../../../deps.ts";

import { introspect } from "./linter.ts";

Deno.test("Plugins > JavaScript > Linter - project with ESLint dedicated config and no ignore file", async () => {
  const fakeContext = deepMerge(
    context,
    {
      files: {
        // deno-lint-ignore require-await
        includes: async (glob: string): Promise<boolean> => {
          if (glob === "**/.eslintrc.{js,cjs,yaml,yml,json}") {
            return true;
          }
          return false;
        },
      },
    },
  );
  const result = await introspect(fakeContext);
  assertEquals(result, { name: "eslint", hasIgnoreFile: false });
});

Deno.test("Plugins > JavaScript > Linter - project with ESLint dedicated config and ignore file", async () => {
  const fakeContext = deepMerge(
    context,
    {
      files: {
        // deno-lint-ignore require-await
        includes: async (glob: string): Promise<boolean> => {
          if (
            glob === "**/.eslintrc.{js,cjs,yaml,yml,json}" ||
            glob === "**/.eslintignore"
          ) {
            return true;
          }
          return false;
        },
      },
    },
  );
  const result = await introspect(fakeContext);
  assertEquals(result, { name: "eslint", hasIgnoreFile: true });
});
