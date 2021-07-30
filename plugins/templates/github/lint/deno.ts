import { FileEntry, readLines } from "../../../mod.ts";

// Search for an import statement from https://deno.land/ or usage from
// the runtime api, such as Deno.cwd(), in JavaScript and TypeScript files
const DENO_IMPORT = /import.*from ["']https:\/\/deno\.land/;
const DENO_RUNTIME = /Deno\..*/;

const TEMPLATE = `
name: Lint Deno
on: push
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - uses: denoland/setup-deno@v1
      with:
        deno-version: v1.x
    - run: deno lint
`;

export default {
  id: "pipelinit.lint-deno",
  platform: "GITHUB",
  glob: "**/*.[j|t]s",
  async process(
    files: AsyncIterableIterator<FileEntry>,
  ): Promise<string | null> {
    for await (const file of files) {
      const fileReader = await Deno.open(file.path);
      for await (const line of readLines(fileReader)) {
        if (DENO_IMPORT.test(line) || DENO_RUNTIME.test(line)) {
          return TEMPLATE;
        }
      }
    }
    return null;
  },
};
