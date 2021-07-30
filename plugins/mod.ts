// Re-export of useful functions and types to write plugins
export { readLines } from "../deps.ts";
import type { WalkEntry } from "../deps.ts";
export type FileEntry = WalkEntry;

// Plugins interfaces and types
type PLATFORMS = "GITHUB";

export interface Template {
  id: string;
  platform: PLATFORMS;
  glob: string;
  process(files: AsyncIterableIterator<FileEntry>): Promise<string | null>;
}

export interface RenderedTemplate {
  template: Template;
  output: string;
}

export abstract class Platform {
  abstract platform: PLATFORMS;
  abstract detect: () => Promise<boolean>;
  abstract output(templates: Array<RenderedTemplate>): Promise<void>;
}

export type ConcretePlatform = { new (): Platform };
