import { assertEquals, context, deepMerge } from "../../../../tests/mod.ts";

import { introspect } from "./mod.ts";

const fakeContext = (
  {
    hasIgnoreFile = true,
  } = {},
) => {
  return deepMerge(
    context,
    {
      files: {
        // deno-lint-ignore require-await
        includes: async (glob: string): Promise<boolean> => {
          if (
            glob === "**/.eslintignore" && hasIgnoreFile
          ) {
            return true;
          }
          if (glob === "**/.eslintrc.{js,cjs,yaml,yml,json}") {
            return true;
          }
          return false;
        },
      },
    },
  );
};

Deno.test("Plugins > _shared > ESLint - dedicated config and no ignore file", async () => {
  const result = await introspect(fakeContext({ hasIgnoreFile: false }));
  assertEquals(result, { name: "eslint", hasIgnoreFile: false });
});

Deno.test("Plugins > _shared > ESLint - dedicated config and ignore file", async () => {
  const result = await introspect(fakeContext({ hasIgnoreFile: true }));
  assertEquals(result, { name: "eslint", hasIgnoreFile: true });
});
