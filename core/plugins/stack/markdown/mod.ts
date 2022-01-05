import { Introspector } from "../../../types.ts";

// deno-lint-ignore no-empty-interface
export default interface MarkdownProject {}

export const introspector: Introspector<MarkdownProject> = {
  detect: async (context) => {
    return await context.files.includes("**/*.md");
  },
  introspect: async (context) => {
    // deno-lint-ignore no-unused-vars
    const logger = await context.getLogger("markdown");
    return {};
  },
};
