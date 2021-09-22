import { IntrospectFn } from "../../../types.ts";
import { introspect as instrospectDjango } from "./django.ts";

// deno-lint-ignore no-empty-interface
interface Django {}

export type Frameworks = {
  django?: Django;
};

export const introspect: IntrospectFn<Frameworks> = async (context) => {
  const frameworks: Frameworks = {};
  const logger = context.getLogger("python");

  const isDjango = await instrospectDjango(context);
  if (isDjango) {
    logger.debug("detected Django");
    frameworks.django = {};
  }

  return frameworks;
};
