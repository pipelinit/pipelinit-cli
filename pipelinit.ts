import { parseArgs } from "./deps.ts";

import { VERSION } from "./src/version.ts";
import defaultCommand from "./src/subcommands/default.ts";

export const PIPELINIT_ROOT = new URL(".", import.meta.url).pathname;

const help = `pipelinit ${VERSION}
Bootstrap and manage CI pipelines.

To start with the default suggestions run at your project root:
  pipelinit

USAGE:
  pipelinit [OPTIONS] <TEMPLATE PLUGINS>

OPTIONS:
  -h, --help                  Prints help information
  -v, --version               Prints the version

SUBCOMMANDS:
    template  Validate and start new pipeline templates
`;

const SUBCOMMANDS = ["template"];

const args = parseArgs(Deno.args, {
  alias: {
    "help": "h",
    "version": "V",
  },
  boolean: [
    "help",
    "version",
  ],
  default: {
    templates: "builtin",
  },
});

if (args._.length === 1 && SUBCOMMANDS.includes(`${args._[0]}`)) {
  const subcommand = args._.shift();
  switch (subcommand) {
    case "template":
      // TODO
      break;
    default:
      break;
  }
}

if (args.version) {
  console.log(`pipelinit ${VERSION}`);
  Deno.exit(0);
}
if (args.help) {
  console.log(help);
  Deno.exit(0);
}
await defaultCommand();
