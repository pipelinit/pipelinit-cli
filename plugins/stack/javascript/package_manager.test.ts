import { context } from "../../../src/plugin/mod.ts";
import { assertEquals, deepMerge } from "../../../deps.ts";

import { introspect } from "./package_manager.ts";

Deno.test("Plugins > JavaScript > Package Manager - project with npm", async () => {
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

Deno.test("Plugins > JavaScript > Package Manager - project with yarn", async () => {
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
