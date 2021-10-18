/**
 * CLI error codes
 */
export const errorCodes = {
  /**
   * 2 = Pipelinit ran without issues, but couldn't find any known stack
   */
  NO_STACK_DETECTED: 2,
  /**
   * 3 = Pipelinit detected at least one stack, but couldn't generate a
   * pipeline for it.
   */
  ALL_STACKS_WITH_ERRORS: 3,
};
