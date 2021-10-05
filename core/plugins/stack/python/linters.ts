import { IntrospectFn } from "../../../types.ts";
import { Flake8, introspect as introspectFlake8 } from "./flake8.ts";

export type Linters = {
  flake8?: Flake8;
};

export const introspect: IntrospectFn<Linters> = async (context) => {
  const linters: Linters = {};
  const logger = context.getLogger("python");

  const flake8Info = await introspectFlake8(context);
  if (flake8Info) {
    logger.debug("detected Flake8");
    linters.flake8 = flake8Info;
  } else {
    if (context.suggestDefault) {
      logger.warning(
        "No linters for python were identified in the project, creating default pipeline with 'flake8' WITHOUT any specific configuration",
      );
      linters.flake8 = {
        isDependency: false,
        name: "flake8",
      };
    }
  }

  return linters;
};
