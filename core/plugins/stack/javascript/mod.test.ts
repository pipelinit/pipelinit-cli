import { context } from "../../../tests/mod.ts";
import { assertEquals, deepMerge } from "../../../deps.ts";
import { FileEntry } from "../../../types.ts";

import { introspector } from "./mod.ts";

const fakeContext = (
  {
    hasTestCommand = true,
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
          return false;
        },
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
          if (glob === "**/package.json") {
            yield {
              name: "package.json",
              path: "fake-path",
            };
          }
          if (glob === "./package.json") {
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
          const scripts = hasTestCommand ? { test: "yarn jest" } : {};
          if (path === "fake-path") {
            return {
              devDependencies: deps,
              scripts: scripts,
            };
          }
          return {};
        },
      },
    },
  );
};

Deno.test("Plugins > Check eslint and node for javascript project with a defined test command", async () => {
  const result = await introspector.introspect(
    fakeContext({ hasTestCommand: true }),
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
    },
    formatters: { prettier: { name: "prettier", hasIgnoreFile: false } },
    hasTestCommand: true,
    type: null,
  });
});

Deno.test("Plugins > Check eslint and node for javascript project with NO defined test command", async () => {
  const result = await introspector.introspect(
    fakeContext({ hasTestCommand: false }),
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
    },
    type: null,
    formatters: { prettier: { name: "prettier", hasIgnoreFile: false } },
    hasTestCommand: false,
  });
});
