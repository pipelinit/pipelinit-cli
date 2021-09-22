import { context } from "../../../tests/mod.ts";
import { assertEquals, deepMerge } from "../../../deps.ts";
import { FileEntry } from "../../../types.ts";

import { introspector } from "./mod.ts";

const fakeContext = (
  {
    isDjango = false,
  } = {},
) => {
  return deepMerge(
    context,
    {
      files: {
        // deno-lint-ignore require-await
        includes: async (glob: string): Promise<boolean> => {
          if (glob === "**/*.py") {
            return true;
          }
          if (glob === "**/manage.py" && isDjango) {
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
};

Deno.test("Plugins > Check if python version and django project is identified", async () => {
  const result = await introspector.introspect(fakeContext({ isDjango: true }));

  assertEquals(result, {
    version: "3.6",
    frameworks: {
      django: {},
    },
  });
});

Deno.test("Plugins > Check if python version and a non-django-project", async () => {
  const result = await introspector.introspect(
    fakeContext({ isDjango: false }),
  );

  assertEquals(result, {
    version: "3.6",
    frameworks: {},
  });
});
