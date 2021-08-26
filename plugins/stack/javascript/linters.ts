import { IntrospectFn } from "../deps.ts";
import {
  ESLint,
  introspect as introspectESLint,
} from "../_shared/eslint/mod.ts";

// deno-lint-ignore no-empty-interface
interface Deno {}

export type Linters = {
  deno?: Deno;
  eslint?: ESLint | null;
} | null;

function anyValue(records: Record<string, unknown>): boolean {
  return Object.values(records).some((v) => v);
}

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
    logger.warning("no supported linter detected, using ESLint");
    return {
      eslint: { name: "eslint", hasIgnoreFile: false },
    };
  }

  logger.debug("no supported linter detected");
  return null;
};
