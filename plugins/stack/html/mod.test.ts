import { context } from "../../../src/plugin/mod.ts";
import { assertEquals, deepMerge, WalkEntry } from "../../../deps.ts";

import { introspector } from "./mod.ts";

Deno.test("Plugins > Html has stylelint and eslint configured", async () => {
  const fakeContext = deepMerge(
    context,
    {
      files: {
        // deno-lint-ignore require-await
        includes: async (glob: string): Promise<boolean> => {
          if (glob === "**/.eslintrc.{js,cjs,yaml,yml,json}") {
            return true;
          }
          return false;
        },
        each: async function* (glob: string): AsyncIterableIterator<WalkEntry> {
          if (glob === "**/*.{html,vue}") {
            yield {
              name: "test.html",
              path: "fake-path",
              isFile: true,
              isSymlink: false,
              isDirectory: false,
            };
            yield {
              name: "test.vue",
              path: "fake-path",
              isFile: true,
              isSymlink: false,
              isDirectory: false,
            };
          }
          if (glob === "**/package.json") {
            yield {
              name: "package.json",
              path: "fake-path",
              isFile: true,
              isSymlink: false,
              isDirectory: false,
            };
          }
          if (glob === "**/.eslintrc.{js,cjs,yaml,yml,json}") {
            yield {
              name: ".eslintrc.js",
              path: "fake-path",
              isFile: true,
              isSymlink: false,
              isDirectory: false,
            };
          }
          if (glob === "**/.eslintignore") {
            yield {
              name: ".eslintignore",
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
          const deps = { stylelint: "1.0.0", eslint: "7.2.2" };
          if (path === "fake-path") {
            return { devDependencies: deps };
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
    runtime: { name: "node", version: "16" },
    packageManager: { name: "npm" },
    linters: {
      eslint: { name: "eslint", hasIgnoreFile: false },
      styleLint: { name: "stylelint" },
    },
    formatters: { prettier: { name: "prettier", hasIgnoreFile: false } },
  });
});
