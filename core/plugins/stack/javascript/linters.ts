import { IntrospectFn } from "../../../types.ts";
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
    logger.warning("No JavaScript linter detected, using ESLint");
    return {
      eslint: { name: "eslint", hasIgnoreFile: false },
    };
  }

  logger.debug("no supported linter detected");
  return null;
};
