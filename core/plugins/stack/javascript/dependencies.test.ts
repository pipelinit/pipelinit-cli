import { context } from "../../../tests/mod.ts";
import { assertEquals, deepMerge } from "../../../deps.ts";
import { FileEntry } from "../../../types.ts";

import { introspect } from "./type.ts";

const fakeContext = (
  {
    isWebApp = false,
    isNode = false,
    isDeno = false,
  } = {},
) => {
  return deepMerge(
    context,
    {
      files: {
        each: async function* (glob: string): AsyncIterableIterator<FileEntry> {
          if (glob === "**/*.{html,vue}") {
            yield {
              name: "index.ts",
              path: "fake-path",
            };
            yield {
              name: "index.js",
              path: "fake-path",
            };
          }
          if (glob === "**/package.json" && isNode) {
            yield {
              name: "package.json",
              path: "fake-path",
            };
          }
          if (glob === "**/deps.ts" && isDeno) {
            yield {
              name: "deps.ts",
              path: "fake-path-deps",
            };
          }
          return;
        },
        // deno-lint-ignore require-await
        readJSON: async (path: string): Promise<Record<string, unknown>> => {
          const devDeps = { stylelint: "1.0.0", eslint: "7.2.2" };
          let dependencies = {};
          if (isWebApp) {
            dependencies = { "vue": "3.0.0" };
          }
          if (path === "fake-path") {
            return {
              dependencies: dependencies,
              devDependencies: devDeps,
            };
          }
          return {};
        },
        // deno-lint-ignore require-await
        readText: async (path: string) => {
          if (path === "fake-path-deps") {
            return `export { deepMerge } from "https://deno.land/std@0.104.0/collections/mod.ts"` +
              (isWebApp
                ? `\nexport { Application, Router } from "https://deno.land/x/oak/mod.ts";`
                : "");
          }
          return "";
        },
      },
    },
  );
};

Deno.test("Plugins > Check if Type is identified correctly as webApp DENO", async () => {
  const result = await introspect(
    fakeContext({ isWebApp: true, isDeno: true }),
  );

  assertEquals(result, "webApp");
});

Deno.test("Plugins > Check if Type is not identified DENO", async () => {
  const result = await introspect(
    fakeContext({ isWebApp: false, isDeno: true }),
  );

  assertEquals(result, null);
});

Deno.test("Plugins > Check if Type is identified correctly as webApp NODE", async () => {
  const result = await introspect(
    fakeContext({ isWebApp: true, isNode: true }),
  );

  assertEquals(result, "webApp");
});

Deno.test("Plugins > Check if Type is not identified NODE", async () => {
  const result = await introspect(
    fakeContext({ isWebApp: false, isNode: true }),
  );

  assertEquals(result, null);
});
