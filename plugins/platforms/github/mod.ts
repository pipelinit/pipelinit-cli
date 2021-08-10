import { ensureFile } from "../../../deps.ts";
import { PlatformWriterFn } from "../platform.ts";

export const github: PlatformWriterFn = async (templates) => {
  for await (const template of templates) {
    const { name, content } = template;
    await ensureFile(`.github/workflows/${name}.yaml`);
    await Deno.writeTextFile(`.github/workflows/${name}.yaml`, content);
  }
};
