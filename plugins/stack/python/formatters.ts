import { IntrospectFn } from "../deps.ts";
import {
  introspect as instrospectBlack,
  Black,
} from "./black.ts"
import {
  introspect as instrospectIsort,
  Isort,
} from "./isort.ts"


export type Formatters = {
  black?: Black | null;
  isort?: Isort | null;
} | null;

function anyValue(records: Record<string, unknown>): boolean {
  return Object.values(records).some((v) => v);
}

export const introspect: IntrospectFn<Formatters> = async (context) => {
  const logger = context.getLogger("python");
  logger.debug("detecting formatter");

  const black = await instrospectBlack(context);
  if (black !== null) {
    logger.debug("detected Black");
  }
  const isort = await instrospectIsort(context);
  if (isort !== null) {
    logger.debug("detected Isort");
  }

  const formatters: Formatters = {
    black,
    isort,
  };

  if (anyValue(formatters)) return formatters;

  if (context.suggestDefault) {
    logger.warning("No Python formatter detected, using Black and Isort");
    return {
      black: { hasBlack: false},
      isort: { hasIsort: false},
    };
  }

  logger.debug("no supported formatter detected");
  return null;
};
