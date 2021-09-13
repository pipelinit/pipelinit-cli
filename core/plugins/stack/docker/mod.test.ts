import { context } from "../../../tests/mod.ts";
import { assertEquals, deepMerge } from "../../../deps.ts";

import { introspector } from "./mod.ts";

Deno.test("Plugins > Check if Dockerfile is identified", async () => {
  const fakeContext = deepMerge(
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
  const result = await introspector.introspect(
    fakeContext,
  );

  assertEquals(result, {
    hasDockerImage: true,
  });
});
