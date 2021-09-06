import { github } from "./github/mod.ts";

export const platformWriters = {
  github,
};
export type platforms = keyof typeof platformWriters;
