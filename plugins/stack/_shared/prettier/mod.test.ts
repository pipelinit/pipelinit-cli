import { context } from "../../../../src/plugin/mod.ts";
import { assertEquals, deepMerge, WalkEntry } from "../../../../deps.ts";

import { introspect } from "./mod.ts";

const fakeContext = (
  withIgnore: boolean,
  prettierVersion: string,
  devDependecies = true,
) => {
  return deepMerge(
    context,
    {
      files: {
        // deno-lint-ignore require-await
        includes: async (glob: string): Promise<boolean> => {
          return withIgnore && glob === "**/.prettierignore";
        },
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
          if (path === "fake-path") {
            if (devDependecies) {
              return {
                devDependencies: {
                  prettier: prettierVersion,
                },
              };
            } else {
              return {
                dependencies: {
                  prettier: prettierVersion,
                },
              };
            }
          }
          return {};
        },
      },
    },
  );
};

Deno.test("Plugins > JavaScript > Formatter - project with Prettier 2 and no ignore file", async () => {
  const result = await introspect(fakeContext(false, "^2.3.2"));
  assertEquals(result, { name: "prettier", hasIgnoreFile: false });
});

Deno.test("Plugins > JavaScript > Formatter - project with Prettier 2 and ignore file", async () => {
  const result = await introspect(fakeContext(true, "^2.3.2"));
  assertEquals(result, { name: "prettier", hasIgnoreFile: true });
});

Deno.test("Plugins > JavaScript > Formatter - project with Prettier 2 (fixed version)", async () => {
  const result = await introspect(fakeContext(true, "2.0.0"));
  assertEquals(result, { name: "prettier", hasIgnoreFile: true });
});

Deno.test("Plugins > JavaScript > Formatter - project with Prettier 2 (production dependency)", async () => {
  const result = await introspect(fakeContext(true, "2.0.0", false));
  assertEquals(result, { name: "prettier", hasIgnoreFile: true });
});

Deno.test("Plugins > JavaScript > Formatter - project with Prettier 1", async () => {
  const result = await introspect(fakeContext(false, "^1.16.4"));
  assertEquals(result, null);
});

Deno.test("Plugins > JavaScript > Formatter - project with unsupported Prettier", async () => {
  const result = await introspect(fakeContext(false, "32.0.0"));
  assertEquals(result, null);
});

Deno.test("Plugins > JavaScript > Formatter - project with broken package definition", async () => {
  const result = await introspect(fakeContext(false, "NOT A VERSION"));
  assertEquals(result, null);
});
