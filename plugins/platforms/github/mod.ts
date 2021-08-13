import { ensureFile, log, PlatformWriterFn } from "../deps.ts";

export const github: PlatformWriterFn = async (templates) => {
  const logger = log.getLogger("main");
  for await (const template of templates) {
    const { name, content } = template;
    const filename = `.github/workflows/${name}.yaml`;
    logger.info(`Writing ${filename}`);
    await ensureFile(filename);
    await Deno.writeTextFile(filename, content);
  }
};
