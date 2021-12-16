import { RenderedTemplate } from "../../../types.ts";
import { assertEquals, context, deepMerge } from "../../../tests/mod.ts";

import { gitlab } from "./mod.ts";

const FAKE_VERSION = "v10.10.10";

// FIXME
// This doesn't work:
// deepMerge(context, { version: FAKE_VERSION });
// Why?
const fakeContext = deepMerge(context, {});
fakeContext.version = FAKE_VERSION;

const fakeYaml = `
lint:
  extends:
    - .lint
  script:
    - pip install -r requirements.txt
    - flake8 --ignore E203,E501,W503 .
`;
const fakeYamlMain = `
stages:
  - lint
  - test

.lint:
  stage: lint
  image: python:3
  needs: []
  script:
    - echo "Starting the Lint stage"

include:
  - local: ".gitlab-ci/pipelinit.python.lint.yaml"
`;

const fakeYamlWithHeaderMain = `# Generated with pipelinit ${FAKE_VERSION}
# https://pipelinit.com/
${fakeYamlMain}`;

const fakeYamlWithHeader = `# Generated with pipelinit ${FAKE_VERSION}
# https://pipelinit.com/
${fakeYaml}`;
fakeYaml;

Deno.test("Plugins > GitHub - prepends a header to generated files", async () => {
  async function* templatesFixture(): AsyncIterableIterator<RenderedTemplate> {
    yield {
      name: "pipelinit.stage",
      content: fakeYaml,
    };
    yield {
      name: ".gitlab-ci.yml",
      content: fakeYamlMain,
    };
    return;
  }
  const result = await gitlab(fakeContext, templatesFixture());
  assertEquals(result.length, 2);
  assertEquals(
    result,
    [{
      path: ".gitlab-ci/pipelinit.stage.yaml",
      content: fakeYamlWithHeader,
    }, {
      path: ".gitlab-ci.yml",
      content: fakeYamlWithHeaderMain,
    }],
  );
});
