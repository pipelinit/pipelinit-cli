import { colors, log } from "../../deps.ts";
import { introspectors } from "../../../core/plugins/mod.ts";

/**
 * Behaves like the ConsoleHandler, but doesn't change the
 * output color. This is left to the formatter function.
 */
class RawConsoleLogHandler extends log.handlers.BaseHandler {
  log(msg: string): void {
    console.log(msg);
  }
}

/**
 * The verbose log handler outputs timestamps, log level, the logger name
 * and doesn't change the color of the output
 */
function verboseHandler() {
  return new RawConsoleLogHandler("DEBUG", {
    formatter: (logRecord) => {
      const { datetime, levelName, loggerName, msg } = logRecord;
      const time = datetime.toISOString();
      return `[${time}] ${levelName}:${loggerName} - ${msg}`;
    },
  });
}

/**
 * The default log handler outputs messages with colors for each respective
 * log level
 */
function defaultHandler() {
  const info = colors.bold.blue;
  const warning = colors.bold.yellow;
  const error = colors.bold;
  const critical = colors.bold.red;
  return new RawConsoleLogHandler("INFO", {
    formatter: (logRecord) => {
      const { levelName, msg } = logRecord;
      switch (levelName) {
        case "INFO":
          return info(msg);
        case "WARNING":
          return warning(msg);
        case "ERROR":
          return error(msg);
        case "CRITICAL":
          return critical(msg);
        default:
          return msg;
      }
    },
  });
}

/**
 * Discover plugins to generate one logger per plugin
 */
function pluginLoggerNames() {
  return introspectors.map((i) => i.name);
}

/**
 * Configure the logger for the CLI app
 * @param debug if debug is `true` the logger level decrease from INFO to DEBUG
 */
export async function setupLogger(debug?: boolean) {
  const logLevel = debug ? "DEBUG" : "INFO";
  const logHandler = debug ? verboseHandler() : defaultHandler();
  const loggerConfig: log.LoggerConfig = {
    level: logLevel,
    handlers: ["console"],
  };

  // Create the static main and default loggers, add one logger per plugin
  const loggers: log.LogConfig["loggers"] = {
    default: loggerConfig,
    main: loggerConfig,
  };
  for (const plugin of pluginLoggerNames()) {
    loggers[plugin] = loggerConfig;
  }

  await log.setup({
    handlers: {
      console: logHandler,
    },
    loggers,
  });
}
