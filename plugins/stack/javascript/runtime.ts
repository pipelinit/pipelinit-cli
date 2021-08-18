import { IntrospectFn } from "../deps.ts";

interface Node {
  name: "node";
  version: string;
}

interface Deno {
  name: "deno";
}

export type Runtime = Node | Deno;

const DENO_IMPORT = /import.*from ["']https:\/\/deno\.land/;
const DENO_RUNTIME = /Deno\..*/;

// Used when the Node.js version can't be introspected
const QUESTION =
  "Couldn't detect the Node.js version. Which version does this project use?";
// Offer versions which are in "Maintenance", "Active" or "Current",
// check those here:
// https://nodejs.org/en/about/releases/
const NODEJS_VERSIONS = [
  "12",
  "14",
  "16",
];

// Latest available version for each major
const NODEJS_LATEST_VERSIONS = [
  "12.22.5",
  "14.17.5",
  "16.7.0",
];

export const introspect: IntrospectFn<Runtime> = async (context) => {
  // If there is user defined configuration, use that value
  if (context.config.plugins.javascript?.runtime) {
    return context.config.plugins.javascript.runtime;
  }

  // Search for an import statement from https://deno.land/ or usage from
  // the runtime api, such as Deno.cwd(), in JavaScript and TypeScript files
  for await (const file of context.files.each("**/*.[j|t]s")) {
    const fileReader = await Deno.open(file.path);
    for await (const line of context.files.readLines(fileReader)) {
      if (DENO_IMPORT.test(line) || DENO_RUNTIME.test(line)) {
        return {
          name: "deno",
        };
      }
    }
    fileReader.close();
  }

  // Search for application specific `.nvmrc` file from nvm
  //
  // See https://github.com/nvm-sh/nvm#nvmrc
  for await (const file of context.files.each("**/.nvmrc")) {
    const version = await Deno.readTextFile(file.path);
    return {
      name: "node",
      version,
    };
  }

  // Look for the Node.js version at "engines.node" in the package.json file
  //
  // See https://docs.npmjs.com/cli/v7/configuring-npm/package-json#engines
  for await (const file of context.files.each("**/package.json")) {
    const packageJson = await context.files.readJSON(file.path);
    if (packageJson?.engines?.node) {
      const nodeEngine = packageJson.engines.node;
      const version = context.semver.minSatisfying(
        NODEJS_LATEST_VERSIONS,
        nodeEngine,
      );
      if (version) {
        return {
          name: "node",
          version: context.semver.major(version).toString(),
        };
      }
    }
  }

  // Didn't find what Node.js version the project uses. Ask the user.
  const version = await context.cli.askOption(QUESTION, NODEJS_VERSIONS);
  // Save it in the configuration to avoid asking again
  const javascriptConfig = (context.config.plugins || {}).javascript || {};
  const runtime = javascriptConfig.runtime || { name: "node", version };
  if (runtime.name === "node") {
    runtime.version = version;
  }
  javascriptConfig.runtime = runtime;
  context.config.plugins.javascript = javascriptConfig;
  await context.config.save();

  return {
    name: "node",
    version,
  };
};
