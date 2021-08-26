import { IntrospectFn } from "../deps.ts";
import {
  introspect as introspectStylelint,
  Stylelint,
} from "../_shared/stylelint/mod.ts";

export type Linters = {
  stylelint?: Stylelint | null;
} | null;

function anyValue(records: Record<string, unknown>): boolean {
  return Object.values(records).some((v) => v);
}

export const introspect: IntrospectFn<Linters> = async (context) => {
  const logger = context.getLogger("javascript");
  logger.debug("detecting linter");

  const stylelint = await introspectStylelint(context);
  if (stylelint !== null) {
    logger.debug("detected stylelint");
  }

  const linters = {
    stylelint,
  };

  if (anyValue(linters)) return linters;

  if (context.suggestDefault) {
    logger.warning("No CSS linter detected, using stylelint");
    return {
      stylelint: { name: "stylelint" },
    };
  }

  logger.debug("no supported linter detected");
  return null;
};
