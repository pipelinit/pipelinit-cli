import { anyValue, IntrospectFn } from "../../../types.ts";
import {
  introspect as introspectPrettier,
  Prettier,
} from "../_shared/prettier/mod.ts";

// deno-lint-ignore no-empty-interface
interface DenoInterface {}

export type Formatters = {
  deno?: DenoInterface;
  prettier?: Prettier | null;
} | null;

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
    logger.warning("No JavaScript formatter detected, using Prettier");
    return {
      prettier: { name: "prettier", hasIgnoreFile: false },
    };
  }

  logger.debug("no supported formatter detected");
  return null;
};
