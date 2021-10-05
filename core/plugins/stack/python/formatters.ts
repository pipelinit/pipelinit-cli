import { IntrospectFn } from "../../../types.ts";
import { Black, introspect as introspectBlack } from "./black.ts";
import { introspect as introspectISort, ISort } from "./isort.ts";

export type Formatters = {
  black?: Black;
  isort?: ISort;
};

export const introspect: IntrospectFn<Formatters> = async (context) => {
  const formatters: Formatters = {};
  const logger = context.getLogger("python");

  const iSortInfo = await introspectISort(context);
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

  if (iSortInfo) {
    logger.debug("detected iSort");
    formatters.isort = iSortInfo;
  } else {
    if (context.suggestDefault) {
      logger.warning(
        "No formatters for python were identified in the project, creating default pipeline with 'isort' WITHOUT any specific configuration",
      );
      formatters.isort = {
        isDependency: false,
        name: "isort",
      };
    }
  }

  return formatters;
};
