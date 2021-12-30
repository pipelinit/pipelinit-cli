import { github } from "./github/mod.ts";
import { gitlab } from "./gitlab/mod.ts";

export const platformWriters = {
  github,
  gitlab,
};
export type platforms = keyof typeof platformWriters;
