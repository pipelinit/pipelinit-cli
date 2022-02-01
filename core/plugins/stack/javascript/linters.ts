import { IntrospectFn } from "../../../types.ts";
import { anyValue } from "../helpers.ts";
import {
  ESLint,
  introspect as introspectESLint,
} from "../_shared/eslint/mod.ts";

// deno-lint-ignore no-empty-interface
interface DenoInterface {}

export type Linters = {
  deno?: DenoInterface;
  eslint?: ESLint | null;
} | null;

export const introspect: IntrospectFn<Linters> = async (context) => {
  const logger = context.getLogger("javascript");
  logger.debug("detecting linter");

  const eslint = await introspectESLint(context);
  if (eslint !== null) {
    logger.debug("detected ESLint");
  }

  const linters = {
    eslint,
  };

  if (anyValue(linters)) return linters;

  if (context.suggestDefault) {
    logger.warning("No JavaScript linter detected, using ESLint");
    return {
      eslint: { name: "eslint", hasIgnoreFile: false },
    };
  }

  logger.debug("no supported linter detected");
  return null;
};
