import { IntrospectFn } from "../../../types.ts";
import { introspect as introspectRubocop, Rubocop } from "./rubocop.ts";

export type Formatters = {
  rubocop?: Rubocop;
};

export const introspect: IntrospectFn<Formatters> = async (context) => {
  const formatters: Formatters = {};
  const logger = context.getLogger("ruby");

  const rubocopInfo = await introspectRubocop(context);

  if (rubocopInfo) {
    logger.debug("detected Rubocop");
    formatters.rubocop = rubocopInfo;
  } else {
    if (context.suggestDefault) {
      logger.warning(
        "No formatters for ruby were identified in the project, creating default pipeline with 'Rubocop' WITHOUT any specific configuration",
      );
      formatters.rubocop = {
        isDependency: false,
        name: "rubocop",
      };
    }
  }

  return formatters;
};
