import { IntrospectFn } from "../../../types.ts";

interface Node {
  name: "node";
  version: {
    gitlab: string;
    github: string;
  };
}

interface DenoInterface {
  name: "deno";
}

export type Runtime = Node | DenoInterface;

const DENO_IMPORT = /import.*from ["']https:\/\/deno\.land/;
const DENO_RUNTIME = /Deno\..*/;

// Use the latest LTS major
// See: https://nodejs.org/en/about/releases/
// GitHub Actions determines the latest minor version
const NODEJS_LATEST_MAJOR = "16";

export const introspect: IntrospectFn<Runtime> = async (context) => {
  // Search for an import statement from https://deno.land/ or usage from
  // the runtime api, such as Deno.cwd(), in JavaScript and TypeScript files
  for await (const file of context.files.each("**/*.[j|t]s")) {
    const fileText = await context.files.readText(file.path);
    if (DENO_IMPORT.test(fileText) || DENO_RUNTIME.test(fileText)) {
      return {
        name: "deno",
      };
    }
  }

  // Search for application specific `.nvmrc` file from nvm
  //
  // See https://github.com/nvm-sh/nvm#nvmrc
  for await (const file of context.files.each("**/.nvmrc")) {
    const version = (await context.files.readText(file.path)).trim();
    return {
      name: "node",
      version: {
        gitlab: version,
        github: version,
      },
    };
  }

  // Look for the Node.js version at "engines.node" in the package.json file
  //
  // See https://docs.npmjs.com/cli/v7/configuring-npm/package-json#engines
  for await (const file of context.files.each("**/package.json")) {
    const packageJson = await context.files.readJSON(file.path);
    if (packageJson?.engines?.node) {
      const nodeEngine = packageJson.engines.node;
      const version = context.semver.minVersion(
        nodeEngine,
      );
      if (version) {
        const versionMajor = context.semver.major(version.toString())
          .toString().trim();
        return {
          name: "node",
          version: {
            github: versionMajor,
            gitlab: versionMajor,
          },
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
    version: {
      gitlab: "latest",
      github: NODEJS_LATEST_MAJOR,
    },
  };
};
