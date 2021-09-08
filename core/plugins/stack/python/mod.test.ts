import { context } from "../../../tests/mod.ts";
import { assertEquals, deepMerge } from "../../../deps.ts";
import { FileEntry } from "../../../types.ts";

import { introspector } from "./mod.ts";

Deno.test("Plugins > Check if python version and django project is identified", async () => {
  const fakeContext = deepMerge(
    context,
    {
      files: {
        // deno-lint-ignore require-await
        includes: async (glob: string): Promise<boolean> => {
          if (glob === "**/*.py") {
            return true;
          }
          if (glob === "**/manage.py") {
            return true;
          }
          return false;
        },
        each: async function* (glob: string): AsyncIterableIterator<FileEntry> {
          if (glob === "**/Pipfile") {
            yield {
              name: "Pipefile",
              path: "fake-path",
            };
          }
          return;
        },
        // deno-lint-ignore require-await
        readToml: async (path: string): Promise<Record<string, unknown>> => {
          if (path === "fake-path") {
            return { requires: { python_version: "3.6" } };
          }
          return {};
        },
      },
    },
  );
  const result = await introspector.introspect(
    fakeContext,
  );

  assertEquals(result, {
    version: "3.6",
    django: true,
  });
});
