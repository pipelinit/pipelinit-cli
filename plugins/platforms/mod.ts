import { github } from "./github/mod.ts";
export type { RenderedTemplate } from "./platform.ts";

export const platformWriters = {
  github,
};
export type platforms = keyof typeof platformWriters;
