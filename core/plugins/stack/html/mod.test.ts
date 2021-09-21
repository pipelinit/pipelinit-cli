import { FileEntry } from "../../../types.ts";
import { assertEquals, context, deepMerge } from "../../../tests/mod.ts";

import { introspector } from "./mod.ts";

const fakeContext = (
  {
    isVue = false,
  } = {},
) => {
  return deepMerge(
    context,
    {
      files: {
        // deno-lint-ignore require-await
        includes: async (glob: string): Promise<boolean> => {
          if (glob === "**/.eslintrc.{js,cjs,yaml,yml,json}") {
            return true;
          }
          if (glob === "**/*.vue" && isVue) {
            return true;
          }
          return false;
        },
        each: async function* (glob: string): AsyncIterableIterator<FileEntry> {
          if (glob === "**/*.{html,vue}") {
            yield {
              name: "test.html",
              path: "fake-path",
            };
            yield {
              name: "test.vue",
              path: "fake-path",
            };
          }
          if (glob === "**/package.json") {
            yield {
              name: "package.json",
              path: "fake-path",
            };
          }
          if (glob === "**/.eslintrc.{js,cjs,yaml,yml,json}") {
            yield {
              name: ".eslintrc.js",
              path: "fake-path",
            };
          }
          if (glob === "**/.eslintignore") {
            yield {
              name: ".eslintignore",
              path: "fake-path",
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
};

Deno.test("Plugins > Html has stylelint and eslint configured", async () => {
  const result = await introspector.introspect(
    fakeContext({ isVue: true }),
  );

  assertEquals(result, {
    runtime: { name: "node", version: "16" },
    packageManager: {
      name: "npm",
      commands: {
        install: "npm ci",
      },
    },
    linters: {
      eslint: { name: "eslint", hasIgnoreFile: false },
      styleLint: { name: "stylelint" },
    },
    formatters: { prettier: { name: "prettier", hasIgnoreFile: false } },
    frameworks: { vue: {} },
  });
});

Deno.test("Plugins > Html has stylelint and eslint configured and not Vue", async () => {
  const result = await introspector.introspect(
    fakeContext({ isVue: false }),
  );

  assertEquals(result, {
    runtime: { name: "node", version: "16" },
    packageManager: {
      name: "npm",
      commands: {
        install: "npm ci",
      },
    },
    linters: {
      eslint: { name: "eslint", hasIgnoreFile: false },
      styleLint: { name: "stylelint" },
    },
    formatters: { prettier: { name: "prettier", hasIgnoreFile: false } },
    frameworks: {},
  });
});
