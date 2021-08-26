import { Context } from "../plugin/mod.ts";

export interface RenderedTemplate {
  name: string;
  content: string;
}

export type PlatformWriterFn = (
  context: Context,
  templates: AsyncIterableIterator<RenderedTemplate>,
) => Promise<void>;
