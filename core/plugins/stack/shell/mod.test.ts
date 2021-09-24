import { context } from "../../../tests/mod.ts";
import { assertEquals, deepMerge } from "../../../deps.ts";

import { introspector } from "./mod.ts";

const fakeContext = (
  {
    hasShellFiles = false,
    hasSuggest = false,
  } = {},
) => {
  return deepMerge(
    context,
    {
      suggestDefault: hasSuggest,
      files: {
        // deno-lint-ignore require-await
        includes: async (glob: string): Promise<boolean> => {
          if (glob === "**/*.{sh,bash}" && hasShellFiles) {
            return true;
          }
          return false;
        },
      },
    },
  );
};

Deno.test("Plugins > Test shell stack with a project with no sh or bash files", async () => {
  const result = await introspector.introspect(
    fakeContext({ hasShellFiles: false, hasSuggest: false }),
  );

  assertEquals(result, {
    linters: {},
  });
});

Deno.test("Plugins > Test shell stack", async () => {
  const result = await introspector.introspect(
    fakeContext({ hasShellFiles: true, hasSuggest: true }),
  );

  assertEquals(result, {
    linters: { shellCheck: {} },
  });
});
