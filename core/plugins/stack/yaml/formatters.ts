import { IntrospectFn } from "../../../types.ts";
import {
  introspect as introspectPrettier,
  Prettier,
} from "../_shared/prettier/mod.ts";

export type Formatters = {
  prettier?: Prettier | null;
} | null;

function anyValue(records: Record<string, unknown>): boolean {
  return Object.values(records).some((v) => v);
}

export const introspect: IntrospectFn<Formatters> = async (context) => {
  const logger = context.getLogger("yaml");
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
    logger.warning("No Yaml formatter detected, using Prettier");
    return {
      prettier: { name: "prettier", hasIgnoreFile: false },
    };
  }

  logger.debug("no supported formatter detected");
  return null;
};
