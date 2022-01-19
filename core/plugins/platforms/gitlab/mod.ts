import { PlatformWriterFn } from "../../../types.ts";

type StageOrder = {
  [key: string]: string[];
};
const stageOrder: StageOrder = {
  "lint": [],
  "format": [],
  "sast": [],
  "test": [],
  "build": [],
};

/*
Form a gitlab-ci.yml
---
# Generated with pipelinit 0.4.0
# https://pipelinit.com/
stages:
  - lint
include:
  - local: ".gitlab-ci/pipelinit.python.lint.yaml"
*/
const gitlabCiTemplate = (
  header: string,
  stages: string,
  includes: string,
) =>
  `${header}
stages:
${stages}
include:
${includes}`;

export const gitlab: PlatformWriterFn = async (context, templates) => {
  const header = `
# Generated with pipelinit ${context.version}
# https://pipelinit.com/
`.trimStart();
  const configurationFiles = [];
  for await (const template of templates) {
    const { name, content } = template;
    // The default name for the template is:
    // pipelinit.<stack>.<stage>
    const [_, stack, stage] = name.split(".");

    stageOrder[stage].push(`  - ${stack}-${stage}\n`);
    configurationFiles.push({
      path: `.gitlab-ci/${name}.yaml`,
      content: `${header}${content}`,
    });
  }

  const stages = Object.values(stageOrder).map((stageText) => {
    return stageText.join("");
  });
  const includes = Object.values(configurationFiles).map((includeName) => {
    return `  - local: "${includeName.path}"\n`;
  }).sort();

  configurationFiles.push({
    path: ".gitlab-ci.yml",
    content: gitlabCiTemplate(header, stages.join(""), includes.join("")),
  });
  return configurationFiles;
};
