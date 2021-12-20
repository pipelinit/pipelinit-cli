import { IntrospectFn } from "../../../types.ts";

// Find the latest stable version here:
// https://www.python.org/downloads/
const LATEST = "3.10";

const WARN_USING_LATEST =
  `Couldn't detect the Python version, using the latest available: ${LATEST}`;

const ERR_UNDETECTABLE_TITLE =
  "Couldn't detect which Python version this project uses.";
const ERR_UNDETECTABLE_INSTRUCTIONS = `
To fix this issue, consider one of the following suggestions:

1. Adopt Pipenv

Pipenv is a tool, which is maintaned by the Python Packaging Authority, that
manages project dependencies, a local virtualenv, split dependencies between
development and production, and declares what is the Python version used in
the project.

See https://pipenv.pypa.io/

2. Adopt Poetry

Poetry is a popular alternative to Pipenv, it solves similar problems and helps
to build and publish Python packages. It also declares what Python version a
project is using.

See https://python-poetry.org/

3. Create a .python-version file

The .python-version file is used by pyenv to choose a specific Python version
for a project.

Its the easiest option, all you have to do is create a .python-version text
file with a version inside, like "3.9".

See https://github.com/pyenv/pyenv
`;

/*Search for a setup.py file with python version*/
const setup: IntrospectFn<string | Error> = async (context) => {
  for await (const file of context.files.each("**/setup.py")) {
    const setupText = await context.files.readText(file.path);

    const setupVersion: string | null = Array.from(
      setupText.matchAll(/python_requires="(..(?<Version>.*))"/gm),
      (match) => !match.groups ? null : match.groups.Version,
    )[0];

    if (setupVersion) {
      return setupVersion;
    }
  }
  return Error("Can't find python version at .setup.py");
};

/**
 * Search for application specific `.python-version` file from pyenv
 *
 * @see https://github.com/pyenv/pyenv/#choosing-the-python-version
 */
const pyenv: IntrospectFn<string | Error> = async (context) => {
  for await (const file of context.files.each("**/.python-version")) {
    return await context.files.readText(file.path);
  }
  return Error("Can't find python version at .python-version");
};

/**
 * Search a Pipfile file, that have a key with the Python version, as managed
 * by pipenv
 *
 * @see https://pipenv.pypa.io/en/latest/basics/#specifying-versions-of-python
 */
const pipfile: IntrospectFn<string | Error> = async (context) => {
  for await (const file of context.files.each("**/Pipfile")) {
    const pipfile = await context.files.readToml(file.path);
    const version = pipfile?.requires?.python_version;
    if (version) return version;
  }
  return Error("Can't find python version at Pipfile");
};

/**
 * Search a pyproject.toml file. If the project uses Poetry, it has a key
 * with the Python version
 *
 * @see https://python-poetry.org/docs/pyproject/#dependencies-and-dev-dependencies
 */
const poetry: IntrospectFn<string | Error> = async (context) => {
  for await (const file of context.files.each("**/pyproject.toml")) {
    const pyproject = await context.files.readToml(file.path);
    const version: string | null = pyproject?.tool?.poetry?.dependencies
      ?.python;
    if (version) {
      // FIXME this simply removes caret and tilde from version specification
      // to convert something like "^3.8" to "3.8". The correct behavior
      // would be to convert it to a range with 3.8, 3.9 and 3.10
      return version.replace(/[\^~]/, "");
    }
  }
  return Error("Can't find python version at pyproject.toml");
};

/**
 * Searches for the project Python version in multiple places, such as:
 * - .python-version (from pyenv)
 * - Pipfile (from Pipenv)
 * - pyproject.toml (used by Poetry too)
 *
 * If it fails to find a version definition anywhere, the next step depends
 * wheter Pipelinit is running in the strict mode. It emits an error if running
 * in the strict mode, otherwise it emits an warning and fallback to the latest
 * stable version.
 */
export const introspect: IntrospectFn<string | undefined> = async (context) => {
  const logger = context.getLogger("python");

  const promises = await Promise.all([
    pyenv(context),
    pipfile(context),
    poetry(context),
    setup(context),
  ]);

  for (const promiseResult of promises) {
    if (typeof promiseResult === "string") {
      return promiseResult;
    } else {
      logger.debug(promiseResult.message);
    }
  }

  if (!context.strict) {
    logger.warning(WARN_USING_LATEST);
    return LATEST;
  }

  context.errors.add({
    title: ERR_UNDETECTABLE_TITLE,
    message: ERR_UNDETECTABLE_INSTRUCTIONS,
  });
};
