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
        "No linters for ruby were identified in the project, creating default pipeline with 'Rubocop' WITHOUT any specific configuration",
      );
      linters.rubocop = {
        isDependency: false,
        name: "rubocop",
      };
    }
  }

  return linters;
};
