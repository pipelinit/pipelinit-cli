import { semver } from "../deps.ts";
import { Context } from "../types.ts";

/**
 * A dummy (noop) context implementation
 */
export const context: Context = {
  getLogger(_?: string) {
    return {
      debug(_: string) {},
      info(_: string) {},
      warning(_: string) {},
      error(_: string) {},
      critical(_: string) {},
    };
  },
  files: {
    // deno-lint-ignore require-yield
    async *each(_) {
      return;
    },
    // deno-lint-ignore require-await
    async includes(_) {
      return false;
    },
    // deno-lint-ignore require-yield
    async *readLines(_) {
      return;
    },
    // deno-lint-ignore require-await
    async readToml(_) {
      return {};
    },
    // deno-lint-ignore require-await
    async readJSON(_) {
      return {};
    },
  },
  errors: {
    add(_) {},
  },
  semver: semver,
  suggestDefault: true,
  version: "v0.0.0",
};
export { assertEquals, deepMerge } from "../deps.ts";
