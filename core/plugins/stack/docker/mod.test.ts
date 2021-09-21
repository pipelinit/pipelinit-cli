import { context } from "../../../tests/mod.ts";
import { assertEquals, deepMerge } from "../../../deps.ts";

import { introspector } from "./mod.ts";

const fakeContext = () => {
  return deepMerge(
    context,
    {
      files: {
        // deno-lint-ignore require-await
        includes: async (glob: string): Promise<boolean> => {
          if (glob === "**/Dockerfile") {
            return true;
          }
          return false;
        },
      },
    },
  );
};

Deno.test("Plugins > Check if Dockerfile is identified", async () => {
  const result = await introspector.introspect(
    fakeContext(),
  );

  assertEquals(result, {
    hasDockerImage: true,
  });
});
