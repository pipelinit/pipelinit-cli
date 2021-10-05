import { IntrospectFn } from "../../../types.ts";

interface Pip {
  name: "pip";
  commands: {
    install: "pip install -r requirements.txt";
    run: "";
  };
}
interface Poetry {
  name: "poetry";
  commands: {
    install: "python -m pip install poetry; poetry install";
    run: "poetry run";
  };
}
interface Pipenv {
  name: "pipenv";
  commands: {
    install: "python -m pip install pipenv; pipenv install --dev";
    run: "pipenv run";
  };
}

export type PackageManager = Pip | Poetry | Pipenv | undefined;

export const introspect: IntrospectFn<PackageManager> = async (context) => {
  const logger = context.getLogger("python");

  if (await context.files.includes("**/poetry.lock")) {
    logger.debug("detected Poetry");
    return <Poetry> {
      name: "poetry",
      commands: {
        install: "python -m pip install poetry; poetry install",
        run: "poetry run",
      },
    };
  }

  if (await context.files.includes("**/Pipfile.lock")) {
    logger.debug("detected Pipenv");
    return <Pipenv> {
      name: "pipenv",
      commands: {
        install: "python -m pip install pipenv; pipenv install --dev",
        run: "pipenv run",
      },
    };
  }

  if (await context.files.includes("**/requirements.txt")) {
    logger.debug("detected Pip");
    return <Pip> {
      name: "pip",
      commands: {
        install: "pip install -r requirements.txt",
        run: "",
      },
    };
  }
};
