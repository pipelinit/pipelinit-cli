import { IntrospectFn } from "../../../types.ts";
import { Flake8, introspect as introspectFlake8 } from "./flake8.ts";
import { introspect as introspectPyLint, PyLint } from "./pylint.ts";

export type Linters = {
  flake8?: Flake8;
  pylint?: PyLint;
};

export const introspect: IntrospectFn<Linters> = async (context) => {
  const linters: Linters = {};
  const logger = context.getLogger("python");

  const flake8Info = await introspectFlake8(context);
  const pyLintInfo = await introspectPyLint(context);

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
  if (!pyLintInfo) {
    linters.pylint = {
      isDependency: false,
      hasConfig: false,
      name: "pylint",
    };
  } else if (pyLintInfo.isDependency) {
    logger.debug("detected Pylint");
    console.log(pyLintInfo);
    linters.pylint = {
      isDependency: true,
      hasConfig: pyLintInfo.hasConfig,
      name: "pylint",
    };
  } else {
    linters.pylint = {
      isDependency: false,
      hasConfig: pyLintInfo.hasConfig,
      name: "pylint",
    };
  }

  return linters;
};
