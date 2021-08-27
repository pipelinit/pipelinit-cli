import { IntrospectFn } from "../deps.ts";
import {
  introspect as instrospectPytest,
  Pytest,
} from "./pytest.ts"

export type Testers = {
  pytest?: Pytest | null;
} | null;

function anyValue(records: Record<string, unknown>): boolean {
  return Object.values(records).some((v) => v);
}

export const introspect: IntrospectFn<Testers> = async (context) => {
  const logger = context.getLogger("python");
  logger.debug("detecting tester");

  const pytest = await instrospectPytest(context);
  if (pytest !== null) {
    logger.debug("detected Pytest");
  }

  const testers: Testers = {
    pytest,
  };

  if (anyValue(testers)) return testers;

  if (context.suggestDefault) {
    logger.warning("No Python tester detected, using Pytest");
    return {
      pytest: { hasPytest: false},
    };
  }

  logger.debug("no supported tester detected");
  return null;
};
