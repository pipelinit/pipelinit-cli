import { assertEquals, context, deepMerge } from "../../../../tests/mod.ts";

import { introspect } from "./mod.ts";

Deno.test("Plugins > _shared > ESLint - dedicated config and no ignore file", async () => {
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

Deno.test("Plugins > _shared > ESLint - dedicated config and ignore file", async () => {
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
