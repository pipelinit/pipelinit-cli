import { ensureFile, PlatformWriterFn } from "../deps.ts";

export const github: PlatformWriterFn = async (context, templates) => {
  const logger = context.getLogger("main");
  const header = `
# Generated with pipelinit ${context.version}
# https://www.pipelinit.com/
`.trimStart();
  for await (const template of templates) {
    const { name, content } = template;
    const filename = `.github/workflows/${name}.yaml`;
    logger.info(`Writing ${filename}`);
    await ensureFile(filename);
    await Deno.writeTextFile(filename, `${header}${content}`);
  }
};
