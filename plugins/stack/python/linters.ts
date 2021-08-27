import { IntrospectFn } from "../deps.ts";
import { Flake8, introspect as instrospectFlake8 } from "./flake8.ts";

export type Linters = {
  flake8?: Flake8 | null;
} | null;

function anyValue(records: Record<string, unknown>): boolean {
  return Object.values(records).some((v) => v);
}

export const introspect: IntrospectFn<Linters> = async (context) => {
  const logger = context.getLogger("python");
  logger.debug("detecting linter");

  const flake8 = await instrospectFlake8(context);
  if (flake8 !== null) {
    logger.debug("detected Flake8");
  }

  const linters: Linters = {
    flake8,
  };

  if (anyValue(linters)) return linters;

  if (context.suggestDefault) {
    logger.warning("No Python linter detected, using Flake8");
    return {
      flake8: { hasFlake8: false },
    };
  }

  logger.debug("no supported linter detected");
  return null;
};
