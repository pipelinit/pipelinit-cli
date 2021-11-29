import { IntrospectFn } from "../../../types.ts";

// Find the latest stable version here:
// https://www.ruby-lang.org/en/downloads/
const LATEST = "3.0.2";

const WARN_USING_LATEST =
  `Couldn't detect the Ruby version, using the latest available: ${LATEST}`;

const ERR_UNDETECTABLE_TITLE =
  "Couldn't detect which Ruby version this project uses.";
const ERR_UNDETECTABLE_INSTRUCTIONS = `
To fix this issue, consider one of the following suggestions:

1. Add the 'required_ruby_version' to your Gemfile

The Gemfile permits the specification of the adequate ruby version for this package.

See https://guides.rubygems.org/specification-reference/#required_ruby_version=

2. Create a .ruby-version file

The .ruby-version file can be used by the RVM(Ruby Version Manager) to choose a specific Ruby version
for a project.

Its the easiest option, all you have to do is create a .ruby-version text
file with a version inside, like "3.0.1".

See https://rvm.io/workflow/projects#project-file-ruby-version
`;

function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined;
}

/**
 * Search for application specific `.ruby-version` file from RVM
 *
 * @see https://rvm.io/workflow/examples#rvm-info
 */
const rvm: IntrospectFn<string | Error> = async (context) => {
  for await (const file of context.files.each("**/.ruby-version")) {
    return await context.files.readText(file.path);
  }
  return Error("Can't find ruby version at .ruby-version");
};

/**
 * Search a Gemfile for the required ruby version key
 */
const gemfile: IntrospectFn<string | Error> = async (context) => {
  for await (const file of context.files.each("./Gemfile")) {
    const gemfileText = await context.files.readText(file.path);

    const rubyVersion: string[] = Array.from(
      gemfileText.matchAll(/ruby ["'](?<RubyVersion>.*)["']/g),
      (match) => !match.groups ? null : match.groups.RubyVersion,
    ).filter(notEmpty);

    if (rubyVersion.length > 0) {
      return rubyVersion[0];
    }
  }
  return Error("Can't find ruby version at Gemfile");
};

/**
 * Search a .gemspec file looking for the key required_ruby_version
 *
 * @see https://guides.rubygems.org/specification-reference/#required_ruby_version=
 */
const gemspec: IntrospectFn<string | Error> = async (context) => {
  for await (const file of context.files.each("./*.gemspec")) {
    const gemspecText = await context.files.readText(file.path);

    const rubyVersion: string[] = Array.from(
      gemspecText.matchAll(
        /required_ruby_version.*(?<RubyVersion>[0-9]+\.[0-9]+\.[0-9])/gm,
      ),
      (match) => !match.groups ? null : match.groups.RubyVersion,
    ).filter(notEmpty);

    if (rubyVersion.length > 0) {
      return rubyVersion[0];
    }
  }
  return Error("Can't find ruby version at RubyVersion");
};

/**
 * Searches for the project Python version in multiple places, such as:
 * - .ruby-version
 * - Gemfile
 * - .gemspec
 *
 * If it fails to find a version definition anywhere, the next step depends
 * wheter Pipelinit is running in the strict mode. It emits an error if running
 * in the strict mode, otherwise it emits an warning and fallback to the latest
 * stable version.
 */
export const introspect: IntrospectFn<string | undefined> = async (context) => {
  const logger = context.getLogger("ruby");

  const promises = await Promise.all([
    rvm(context),
    gemfile(context),
    gemspec(context),
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
