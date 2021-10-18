import { IntrospectionError, log } from "../../../deps.ts";

/**
 * Holds a list of fatal errors for stack introspection
 */
const errorList: IntrospectionError[] = [];

export const errors = {
  list: errorList,
  add: (error: IntrospectionError) => {
    errors.list.push(error);
  },
};

export const anyError = () => {
  return errors.list.length > 0;
};

export const outputErrors = () => {
  if (errors.list.length === 0) return;
  const logger = log.getLogger("main");
  logger.warning("Didn't generate pipeline for every detected stack!");
  for (const error of errors.list) {
    logger.critical(error.title);
    logger.error(error.message);
  }
  logger.warning(
    "If you don't want to change your project now, try again with the --no-strict flag.",
  );
};
