import { PlatformWriterFn } from "../deps.ts";

export const github: PlatformWriterFn = async (context, templates) => {
  const header = `
# Generated with pipelinit ${context.version}
# https://pipelinit.com/
`.trimStart();
  const configurationFiles = [];
  for await (const template of templates) {
    const { name, content } = template;
    configurationFiles.push({
      path: `.github/workflows/${name}.yaml`,
      content: `${header}${content}`,
    });
  }
  return configurationFiles;
};
