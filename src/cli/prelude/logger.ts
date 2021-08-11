import { log } from "../../../deps.ts";

/**
 * Configure the logger for the CLI app
 * @param debug if debug is `true` the logger level decrease from INFO to DEBUG
 */
export async function setupLogger(debug?: boolean) {
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
