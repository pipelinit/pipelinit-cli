import { Command } from "./deps.ts";
import { PIPELINIT_VERSION } from "./deps.ts";
import defaultCommand from "./src/commands/default.ts";

export const PIPELINIT_ROOT = new URL(".", import.meta.url).pathname;

await new Command()
  .name("pipelinit")
  .version(PIPELINIT_VERSION)
  .description("Bootstrap and manage CI pipelines")
  .option(
    "-d, --debug [debug:boolean]",
    "Output more information, useful for debugging",
    { global: true },
  )
  .option(
    "--no-default-stage [no-default-stage:boolean]",
    "Disable default suggestion for a CI stage when can't detect a supported tool",
  )
  .option(
    "--no-strict [no-strict:boolean]",
    "Disable strict mode. Generates less errors with suggestions to change the project, but may generate less complete or less accurate pipelines.",
  )
  .action(defaultCommand)
  .parse(Deno.args);
