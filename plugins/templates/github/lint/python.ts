import { FileEntry, Template } from "../../../mod.ts";

const TEMPLATE = `
name: Lint Python
on: push
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Set up Python
      uses: actions/setup-python@v2
      with:
        python-version: 3.9
    - run: python -m pip install flake8
    - run: flake8
`;

const plugin: Template = {
  id: "pipelinit.lint-python",
  platform: "GITHUB",
  glob: "**/*.py",
  async process(
    files: AsyncIterableIterator<FileEntry>,
  ): Promise<string | null> {
    if ((await files.next()).done) {
      return null;
    }
    return TEMPLATE;
  },
};

export default plugin;
