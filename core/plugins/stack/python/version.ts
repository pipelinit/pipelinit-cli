import { IntrospectFn } from "../../../types.ts";

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

export const introspect: IntrospectFn<string | undefined> = async (context) => {
  // Search for application specific `.python-version` file from pyenv
  //
  // See https://github.com/pyenv/pyenv/#choosing-the-python-version
  for await (const file of context.files.each("**/.python-version")) {
    return await context.files.readText(file.path);
  }

  // Search a Pipfile file, that have a key with the Python version, as managed
  // by pipenv
  //
  // See https://pipenv.pypa.io/en/latest/basics/#specifying-versions-of-python
  for await (const file of context.files.each("**/Pipfile")) {
    const pipfile = await context.files.readToml(file.path);
    const version = pipfile?.requires?.python_version;
    if (version) return version;
  }

  // Search a pyproject.toml file. If the project uses Poetry, it has a key
  // with the Python version
  //
  // See https://python-poetry.org/docs/pyproject/#dependencies-and-dev-dependencies
  for await (const file of context.files.each("**/pyproject.toml")) {
    const pyproject = await context.files.readToml(file.path);
    const version: string | null = pyproject?.tool?.poetry?.dependencies
      ?.python;
    if (version) {
      // FIXME this simply removes caret and tilde from version specification
      // to convert something like "^3.6" to "3.6". The correct behavior
      // would be to convert it to a range with 3.6, 3.7, 3.8 and 3.9
      return version.replace(/[\^~]/, "");
    }
  }

  context.errors.add({
    title: ERR_UNDETECTABLE_TITLE,
    message: ERR_UNDETECTABLE_INSTRUCTIONS,
  });
};
