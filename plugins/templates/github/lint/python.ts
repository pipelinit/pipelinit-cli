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

interface FileEntry {
  path: string;
  name: string;
  isFile: boolean;
  isDirectory: boolean;
  isSymlink: boolean;
}

export default {
  id: "dev.operous.pipelinit.lint-python",
  platform: "GITHUB",
  glob: "**/*.py",
  async process(
    files: AsyncIterableIterator<FileEntry>,
  ): Promise<string | null> {
    if (await files.next()) {
      return TEMPLATE;
    }
    return null;
  },
};
