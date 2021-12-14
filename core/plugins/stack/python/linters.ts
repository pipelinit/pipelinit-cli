import { IntrospectFn } from "../../../types.ts";
import { Bandit, introspect as introspectBandit } from "./bandit.ts";
import { Flake8, introspect as introspectFlake8 } from "./flake8.ts";
import { introspect as introspectPyLint, PyLint } from "./pylint.ts";

export type Linters = {
  flake8?: Flake8;
  pylint?: PyLint;
  bandit?: Bandit;
};

export const introspect: IntrospectFn<Linters> = async (context) => {
  const linters: Linters = {};
  const logger = context.getLogger("python");

  const flake8Info = await introspectFlake8(context);
  const pyLintInfo = await introspectPyLint(context);
  const banditInfo = await introspectBandit(context);

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

  if (pyLintInfo) {
    logger.debug("detected Pylint");
    linters.pylint = pyLintInfo;
  }

  if (banditInfo) {
    logger.debug("detected Bandit");
    linters.bandit = banditInfo;
  } else {
    if (context.suggestDefault) {
      logger.warning(
        "No linters for python were indentified in the project, creating default with 'bandit' WITHOUT any specific configuration",
      );
      linters.bandit = {
        isDependency: false,
        name: "bandit",
      };
    }
  }

  return linters;
};
