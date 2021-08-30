import { context } from "../../../src/plugin/mod.ts";
import { assertEquals, deepMerge } from "../../../deps.ts";
import { RenderedTemplate } from "../../../src/platform/plugin.ts";

import { github } from "./mod.ts";

const FAKE_VERSION = "v10.10.10";

// FIXME
// This doesn't work:
// deepMerge(context, { version: FAKE_VERSION });
// Why?
const fakeContext = deepMerge(context, {});
fakeContext.version = FAKE_VERSION;

const fakeYaml = `
name: Runner check
on: pull_request
jobs:
  stage:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: ls
`;

const fakeYamlWithHeader = `# Generated with pipelinit ${FAKE_VERSION}
# https://www.pipelinit.com/
${fakeYaml}`;

Deno.test("Plugins > GitHub - prepends a header to generated files", async () => {
  async function* templatesFixture(): AsyncIterableIterator<RenderedTemplate> {
    yield {
      name: "pipelinit.stage",
      content: fakeYaml,
    };
    return;
  }
  const result = await github(fakeContext, templatesFixture());
  assertEquals(result.length, 1);
  assertEquals(
    result,
    [{
      path: ".github/workflows/pipelinit.stage.yaml",
      content: fakeYamlWithHeader,
    }],
  );
});
