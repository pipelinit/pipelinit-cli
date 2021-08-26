/**
 * Options available for every command and subcommand of the CLI
 */
export interface GlobalOptions {
  /**
   * Run in debug mode, turn off human-friendly messages and
   * turn on the verbose output mode, with debug logs.
   */
  debug?: boolean;
  /**
   * This flag determines if the Stack Plugins should suggest a default
   * tool when it can't find any of the supported ones
   */
  defaultStage: boolean;
}
