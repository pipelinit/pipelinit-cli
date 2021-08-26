import { Command } from "./deps.ts";
import { VERSION } from "./src/version.ts";
import defaultCommand from "./src/cli/commands/default.ts";

export const PIPELINIT_ROOT = new URL(".", import.meta.url).pathname;

await new Command()
  .name("pipelinit")
  .version(VERSION)
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
  .action(defaultCommand)
  .parse(Deno.args);
