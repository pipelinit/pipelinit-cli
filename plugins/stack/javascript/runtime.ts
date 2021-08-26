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

// Use the major with status "Current" at https://nodejs.org/en/about/releases/
const NODEJS_LATEST_MAJOR = "16";

// Latest available version for each major
const NODEJS_LATEST_VERSIONS = [
  "12.22.5",
  "14.17.5",
  "16.7.0",
];

export const introspect: IntrospectFn<Runtime> = async (context) => {
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

  // If couldn't detect the Node.js version neither in the .nvmrc nor in the
  // package.json file, use the latest available version, per the
  // documentation:
  //
  // > And, like with dependencies, if you don't specify the version (or if
  // > you specify "*" as the version), then any version of node will do.
  //
  // See https://docs.npmjs.com/cli/v7/configuring-npm/package-json#engines
  return {
    name: "node",
    version: NODEJS_LATEST_MAJOR,
  };
};
