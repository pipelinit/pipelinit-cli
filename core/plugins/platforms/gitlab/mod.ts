import { PlatformWriterFn } from "../../../types.ts";

export const gitlab: PlatformWriterFn = async (context, templates) => {
  const header = `
# Generated with pipelinit ${context.version}
# https://pipelinit.com/
`.trimStart();
  const configurationFiles = [];
  for await (const template of templates) {
    const { name, content } = template;
    if (name.includes(".gitlab-ci")) {
      configurationFiles.push({
        path: ".gitlab-ci.yml",
        content: `${header}${content}`,
      });
      continue;
    }
    configurationFiles.push({
      path: `.gitlab-ci/${name}.yaml`,
      content: `${header}${content}`,
    });
  }
  return configurationFiles;
};
