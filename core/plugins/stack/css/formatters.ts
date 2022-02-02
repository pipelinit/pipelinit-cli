import { IntrospectFn } from "../../../types.ts";
import { anyValue } from "../helpers.ts";
import {
  introspect as introspectPrettier,
  Prettier,
} from "../_shared/prettier/mod.ts";

export type Formatters = {
  prettier?: Prettier | null;
} | null;

export const introspect: IntrospectFn<Formatters> = async (context) => {
  const logger = context.getLogger("css");
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
    logger.warning("No CSS formatter detected, using Prettier");
    return {
      prettier: { name: "prettier", hasIgnoreFile: false },
    };
  }

  logger.debug("no supported formatter detected");
  return null;
};
