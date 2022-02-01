import { IntrospectFn } from "../../../types.ts";
import { anyValue } from "../helpers.ts";
import {
  introspect as introspectStylelint,
  Stylelint,
} from "../_shared/stylelint/mod.ts";

export type Linters = {
  stylelint?: Stylelint | null;
} | null;

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
    logger.warning("No CSS linter detected, using Stylelint");
    return {
      stylelint: { name: "stylelint", isDependency: true },
    };
  }

  logger.debug("no supported linter detected");
  return linters;
};
