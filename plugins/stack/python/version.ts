import { IntrospectFn } from "../deps.ts";

// Used when the Python version can't be introspected
const QUESTION =
  "Couldn't determine the Python version. Please select an option";
// Offer current available Python versions, check those here:
// https://devguide.python.org/#status-of-python-branches
const PYTHON_VERSIONS = [
  "3.6",
  "3.7",
  "3.8",
  "3.9",
];

export const introspect: IntrospectFn<string> = async (context) => {
  const { helpers } = context;

  // Search for application specific `.python-version` file from pyenv
  //
  // See https://github.com/pyenv/pyenv/#choosing-the-python-version
  for await (const file of helpers.files("**/.python-version")) {
    return await Deno.readTextFile(file.path);
  }

  // Search a Pipfile file, that have a key with the Python version, as managed
  // by pipenv
  //
  // See https://pipenv.pypa.io/en/latest/basics/#specifying-versions-of-python
  for await (const file of helpers.files("**/Pipfile")) {
    const pipfile = await helpers.readToml(file.path);
    const version = pipfile?.requires?.python_version;
    if (version) return version;
  }

  // Search a pyproject.toml file. If the project uses Poetry, it has a key
  // with the Python version
  //
  // See https://python-poetry.org/docs/pyproject/#dependencies-and-dev-dependencies
  for await (const file of helpers.files("**/pyproject.toml")) {
    const pyproject = await helpers.readToml(file.path);
    const version: string | null = pyproject?.tool?.poetry?.dependencies
      ?.python;
    if (version) {
      // TODO this simply removes caret and tilde from version specification
      // to convert something like "^3.6" to "3.6". Maybe a more suitable
      // behaviour would be to convert it to 3.6, 3.7, 3.8 and 3.9
      return version.replace(/[\^~]/, "");
    }
  }

  // Didn't find what python version the project uses. Ask the user.
  return await helpers.askOption(QUESTION, PYTHON_VERSIONS);
};
