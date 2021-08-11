export interface RenderedTemplate {
  name: string;
  content: string;
}

export type PlatformWriterFn = (
  templates: AsyncIterableIterator<RenderedTemplate>,
) => Promise<void>;
