import { context } from "../../../../../cli/src/plugin/mod.ts";
import { assertEquals, deepMerge } from "../../../../../cli/deps.ts";

import { introspect } from "./mod.ts";

Deno.test("Plugins > _shared > Node Package Manager - npm", async () => {
  // Mock the original context to return false when the introspection
  // function search for the "yarn.lock" file.
  const fakeContext = deepMerge(
    context,
    {
      files: {
        // deno-lint-ignore require-await
        includes: async (_glob: string): Promise<boolean> => {
          return Promise.resolve(false);
        },
      },
    },
  );
  const result = await introspect(fakeContext);
  assertEquals(result, { name: "npm" });
});

Deno.test("Plugins > _shared > Node Package Manager - yarn", async () => {
  // Mock the original context to return true when the introspection
  // function search for the "yarn.lock" file.
  const fakeContext = deepMerge(
    context,
    {
      files: {
        // deno-lint-ignore require-await
        includes: async (glob: string): Promise<boolean> => {
          if (glob === "**/yarn.lock") {
            return true;
          }
          return false;
        },
      },
    },
  );
  const result = await introspect(fakeContext);
  assertEquals(result, { name: "yarn" });
});
