import { context } from "../../../../../cli/src/plugin/mod.ts";
import { assertEquals, deepMerge, WalkEntry } from "../../../../../cli/deps.ts";

import { introspect } from "./mod.ts";

const fakeContext = (
  {
    withStylelint = true,
    devDependencies = true,
  } = {},
) => {
  return deepMerge(
    context,
    {
      files: {
        each: async function* (glob: string): AsyncIterableIterator<WalkEntry> {
          if (glob === "**/package.json") {
            yield {
              name: "package.json",
              path: "fake-path",
              isFile: true,
              isSymlink: false,
              isDirectory: false,
            };
          }
          return;
        },
        // deno-lint-ignore require-await
        readJSON: async (path: string): Promise<Record<string, unknown>> => {
          const deps = { stylelint: "1.0.0" };
          if (!withStylelint) return {};
          if (path === "fake-path") {
            return devDependencies
              ? { devDependencies: deps }
              : { dependencies: deps };
          }
          return {};
        },
      },
    },
  );
};

Deno.test("Plugins > _shared > Stylelint - at devDependecies", async () => {
  const result = await introspect(fakeContext());
  assertEquals(result, { name: "stylelint" });
});

Deno.test("Plugins > _shared > Stylelint - at dependecies", async () => {
  const result = await introspect(fakeContext({ devDependencies: false }));
  assertEquals(result, { name: "stylelint" });
});

Deno.test("Plugins > _shared > Stylelint - not present", async () => {
  const result = await introspect(fakeContext({ withStylelint: false }));
  assertEquals(result, null);
});
