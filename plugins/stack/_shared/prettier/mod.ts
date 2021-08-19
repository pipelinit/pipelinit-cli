import { IntrospectFn } from "../../deps.ts";

export interface Prettier {
  name: "prettier";
  hasIgnoreFile: boolean;
}

const PRETTIER_V1_WARNING = `
Detected Prettier 1 in the project.
Pipelinit can't generate pipelines for Prettier 1, please consider
upgrading Prettier to version 2.x

It has a lot of improvements over previous versions and migration
isn't hard. Read more about it here:
https://prettier.io/blog/2020/03/21/2.0.0.html
`;

export const introspect: IntrospectFn<Prettier | null> = async (context) => {
  const logger = context.getLogger("javascript");

  // See https://prettier.io/docs/en/ignore.html
  const hasIgnoreFile = await context.files.includes("**/.prettierignore");

  // Check if the project has Prettier 2 installed, if it has Prettier 1
  // generates a warning to the user recommending an upgrade.
  //
  // The improvements to Prettier CLI in version > 2 makes it more
  // automation friendly, and the online documentation shows usage for v2.x
  //
  // The migration path for the end-user of Prettier isn't painfull too, it
  // looks like it gave more work to plugin authors:
  // https://prettier.io/blog/2020/03/21/2.0.0.html
  //
  const hasPrettier2 = (packages: Record<string, string>): boolean => {
    for (const [pkg, version] of Object.entries(packages)) {
      if (pkg === "prettier") {
        let prettierMajor: number;
        if (context.semver.valid(version)) {
          prettierMajor = context.semver.major(version);
        } else if (context.semver.validRange(version)) {
          prettierMajor = context.semver.minVersion(version)!.major;
        } else {
          logger.warning(
            `couldn't detect Prettier major for version "${version}"`,
          );
          return false;
        }

        if (prettierMajor === 1) {
          logger.warning(PRETTIER_V1_WARNING);
        } else if (prettierMajor === 2) {
          return true;
        } else {
          logger.warning(
            `detected unsupported version for Prettier: "${version}"`,
          );
          return false;
        }
      }
    }
    return false;
  };

  for await (const file of context.files.each("**/package.json")) {
    const packageJson = await context.files.readJSON(file.path);
    const packages = {
      ...(packageJson?.dependencies || {}),
      ...(packageJson?.devDependencies || {}),
    };
    if (hasPrettier2(packages)) {
      return {
        "name": "prettier",
        hasIgnoreFile,
      };
    }
  }

  return null;
};
