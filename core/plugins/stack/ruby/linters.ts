import { IntrospectFn } from "../../../types.ts";
import { introspect as introspectRubocop, Rubocop } from "./rubocop.ts";

export type Linters = {
  rubocop?: Rubocop;
};

export const introspect: IntrospectFn<Linters> = async (context) => {
  const linters: Linters = {};
  const logger = context.getLogger("ruby");

  const rubocopInfo = await introspectRubocop(context);
  if (rubocopInfo) {
    logger.debug("detected Rubocop");
    linters.rubocop = rubocopInfo;
  } else {
    if (context.suggestDefault) {
      logger.warning(
        "No Ruby linter detected, using Rubocop",
      );
      linters.rubocop = {
        isDependency: false,
        name: "rubocop",
      };
    }
  }

  return linters;
};
