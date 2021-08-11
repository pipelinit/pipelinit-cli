import { log } from "../../deps.ts";

export interface GlobalOptions {
  debug?: boolean;
}

async function setupLogger(debug?: boolean) {
  const logLevel = debug ? "DEBUG" : "INFO";
  await log.setup({
    handlers: {
      console: new log.handlers.ConsoleHandler("DEBUG"),
    },
    loggers: {
      default: {
        level: logLevel,
        handlers: ["console"],
      },
    },
  });
}

export async function prelude(opts: GlobalOptions) {
  await setupLogger(opts.debug);
}
