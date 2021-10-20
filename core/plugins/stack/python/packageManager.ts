import { IntrospectFn } from "../../../types.ts";

/**
 * A PackageManager object, with shortcuts for useful commands
 */
export type PackageManager = {
  name: string;
  commands: {
    /**
     * Install all project dependencies
     */
    install: string;
    /**
     * Prefix used to run commands within the project dependencies scope
     */
    run: string;
  };
} | undefined;

/**
 * Detects if a project uses [Poetry](https://python-poetry.org/)
 */
const poetry: IntrospectFn<PackageManager> = async (context) => {
  if (await context.files.includes("**/poetry.lock")) {
    return {
      name: "poetry",
      commands: {
        install: "python -m pip install poetry; poetry install",
        run: "poetry run",
      },
    };
  }
  throw Error("Can't find Poetry");
};

/**
 * Detects if a project uses [Pipenv](pipenv.pypa.io)
 */
const pipenv: IntrospectFn<PackageManager> = async (context) => {
  if (await context.files.includes("**/Pipfile.lock")) {
    return {
      name: "pipenv",
      commands: {
        install: "python -m pip install pipenv; pipenv install --dev",
        run: "pipenv run",
      },
    };
  }
  throw Error("Can't find Pipenv");
};

/**
 * Detects if a project uses a requirements file. Check only the non-enforced
 * standard "requirements.txt" name.
 *
 * > *(...) requirements.txt is usually what these files are named
 * > (although, that is not a requirement)*
 *
 * See:
 * https://pip.pypa.io/en/stable/reference/requirements-file-format/#requirements-file-format
 */
const requirements: IntrospectFn<PackageManager> = async (context) => {
  if (await context.files.includes("**/requirements.txt")) {
    return {
      name: "pip",
      commands: {
        install: "pip install -r requirements.txt",
        run: "",
      },
    };
  }
  throw Error("Can't find requirements.txt");
};

/**
 * Searches how the Python project manage dependencies. Looks for one of these:
 * - Poetry usage
 * - Pipenv usage
 * - requirements.txt usage
 */
export const introspect: IntrospectFn<PackageManager> = async (context) => {
  try {
    return await Promise.any([
      poetry(context),
      pipenv(context),
      requirements(context),
    ]);
  } catch (error: unknown) {
    if (error instanceof AggregateError) {
      return undefined;
    } else {
      throw error;
    }
  }
};
