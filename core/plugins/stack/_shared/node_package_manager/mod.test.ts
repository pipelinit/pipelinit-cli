import { assertEquals, context, deepMerge } from "../../../../tests/mod.ts";

import { introspect } from "./mod.ts";

const fakeContext = (
  {
    hasYarnLock = true,
  } = {},
) => {
  // Mock the original context to return false when the introspection
  // function search for the "yarn.lock" file.
  return deepMerge(
    context,
    {
      files: {
        // deno-lint-ignore require-await
        includes: async (glob: string): Promise<boolean> => {
          if (glob === "**/yarn.lock" && hasYarnLock) {
            return true;
          }
          return false;
        },
      },
    },
  );
};

Deno.test("Plugins > _shared > Node Package Manager - npm", async () => {
  const result = await introspect(fakeContext({ hasYarnLock: false }));
  assertEquals(result, {
    name: "npm",
    commands: {
      install: "npm ci",
    },
  });
});

Deno.test("Plugins > _shared > Node Package Manager - yarn", async () => {
  // Mock the original context to return true when the introspection
  // function search for the "yarn.lock" file.
  const result = await introspect(fakeContext({ hasYarnLock: true }));
  assertEquals(result, {
    name: "yarn",
    commands: {
      install: "yarn",
    },
  });
});
