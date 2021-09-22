import { IntrospectFn } from "../../../types.ts";
import { introspect as instrospectVue } from "./vue.ts";

// deno-lint-ignore no-empty-interface
interface Vue {}

export type Frameworks = {
  vue?: Vue;
};

export const introspect: IntrospectFn<Frameworks> = async (context) => {
  const logger = context.getLogger("html");
  const frameworks: Frameworks = {};
  logger.debug("detecting linter");

  const isVue = await instrospectVue(context);
  if (isVue) {
    logger.debug("detected Vue.Js");
    frameworks.vue = {};
  }

  return frameworks;
};
