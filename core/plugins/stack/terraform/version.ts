import { IntrospectFn } from "../../../types.ts";

// Find the latest stable version here:
// https://www.terraform.io/downloads
const LATEST = "1.1.2";

const WARN_USING_LATEST =
  `Couldn't detect the Terraform version, using the latest available: ${LATEST}`;

const ERR_UNDETECTABLE_TITLE =
  "Couldn't detect which Terraform version this project uses.";
const ERR_UNDETECTABLE_INSTRUCTIONS = `
To fix this issue, consider one of the following suggestions:

1. Add the 'required_version' to your .tf file

See https://www.terraform.io/language/settings#specifying-a-required-terraform-version

2. Create a .terraform-version file

The .terraform-version file can be used by the tfenv to choose a specific Terraform version
for a project.

It's the easiest option, all you have to do is create a .terraform-version text
file with a version inside, like "1.1.0".

See https://github.com/tfutils/tfenv
`;

const terraformVerRegex =
  /required_version = ["'](?<TerraformVersion>.*(v?([0-9]+(\.[0-9]+)*?))*?)["']/;

const tfenv: IntrospectFn<string | Error> = async (context) => {
  for await (const file of context.files.each("**/.terraform-version")) {
    return await context.files.readText(file.path);
  }
  return Error("Can't find terraform version at .terraform-version");
};

const tfFile: IntrospectFn<string | Error> = async (context) => {
  for await (const file of context.files.each("**/*.tf")) {
    const tfText = await context.files.readText(file.path);
    const matchGroups = tfText.match(terraformVerRegex)?.groups || {};

    if ("TerraformVersion" in matchGroups) {
      const ver = matchGroups["TerraformVersion"].split(",").join("");

      if (context.semver.valid(ver)) {
        return context.semver.valid(ver)!.toString();
      } else if (context.semver.validRange(ver)) {
        return context.semver.minVersion(ver)!.toString();
      }
    }
  }
  return Error("Can't find terraform version at .tf file");
};

export const introspect: IntrospectFn<string | undefined> = async (context) => {
  const logger = context.getLogger("terraform");

  const promises = await Promise.all([
    tfFile(context),
    tfenv(context),
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
