import { IntrospectFn } from "../../../types.ts";
import { introspect as introspectShellCheck } from "./shellcheck.ts";

// deno-lint-ignore no-empty-interface
interface ShellCheck {}

export type Linters = {
  shellCheck?: ShellCheck;
};

export const introspect: IntrospectFn<Linters> = async (context) => {
  const linters: Linters = {};
  const logger = context.getLogger("shell");

  const hasShellCheck = await introspectShellCheck(context);
  if (hasShellCheck) {
    logger.debug("detected ShellCheck");
    linters.shellCheck = {};
  }

  return linters;
};
