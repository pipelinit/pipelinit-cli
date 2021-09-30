import { IntrospectFn } from "../../../types.ts";
import { Black, introspect as introspectBlack } from "./black.ts";

export type Formatters = {
  black?: Black;
};

export const introspect: IntrospectFn<Formatters> = async (context) => {
  const formatters: Formatters = {};
  const logger = context.getLogger("python");

  const blackInfo = await introspectBlack(context);
  if (blackInfo) {
    logger.debug("detected Black");
    formatters.black = blackInfo;
  } else {
    if (context.suggestDefault) {
      logger.warning(
        "No formatters for python were identified in the project, creating default pipeline with 'black' WITHOUT any specific configuration",
      );
      formatters.black = {
        isDependency: false,
        name: "black",
      };
    }
  }

  return formatters;
};
