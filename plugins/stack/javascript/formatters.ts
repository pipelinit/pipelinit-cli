import { IntrospectFn } from "../deps.ts";
import {
  introspect as introspectPrettier,
  Prettier,
} from "../_shared/prettier/mod.ts";

// deno-lint-ignore no-empty-interface
interface Deno {}

export type Formatters = {
  deno?: Deno;
  prettier?: Prettier | null;
} | null;

function anyValue(records: Record<string, unknown>): boolean {
  return Object.values(records).some((v) => v);
}

export const introspect: IntrospectFn<Formatters> = async (context) => {
  const logger = context.getLogger("javascript");
  logger.debug("detecting formatter");

  const prettier = await introspectPrettier(context);
  if (prettier !== null) {
    logger.debug("detected Prettier");
  }

  const formatters: Formatters = {
    prettier,
  };

  if (anyValue(formatters)) return formatters;

  if (context.suggestDefault) {
    logger.warning("no supported formatter detected, using Prettier");
    return {
      prettier: { name: "prettier", hasIgnoreFile: false },
    };
  }

  logger.debug("no supported formatter detected");
  return null;
};
