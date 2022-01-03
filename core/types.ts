export interface FileEntry {
  /**
   * The filename with extension
   */
  name: string;
  /**
   * The file full path
   */
  path: string;
}

interface Logger {
  debug(msg: string): void;
  info(msg: string): void;
  warning(msg: string): void;
  error(msg: string): void;
  critical(msg: string): void;
}

export interface IntrospectionError {
  title: string;
  message: string;
}

interface SemVer {
  major: number;
  minor: number;
  patch: number;
}

interface SemVerHelpers {
  valid(version: string): string | null;
  major(version: string): number;
  validRange(range: string): string | null;
  minVersion(range: string): SemVer | null;
  minSatisfying(
    versions: readonly string[],
    range: string,
  ): string | null;
}

export type Context = {
  getLogger(name?: string): Logger;
  dependencies: string[];
  files: {
    each(glob: string): AsyncIterableIterator<FileEntry>;
    includes(glob: string): Promise<boolean>;
    // deno-lint-ignore no-explicit-any
    readJSON(path: string): Promise<any>;
    readLines(path: string): AsyncIterableIterator<string>;
    readText(path: string): Promise<string>;
    // deno-lint-ignore no-explicit-any
    readToml(path: string): Promise<any>;
  };
  errors: {
    add(error: IntrospectionError): void;
  };
  semver: SemVerHelpers;
  suggestDefault: boolean;
  /**
   * When the strict mode is on, the plugin code can err and ask the user to
   * make some changes in the project to make it more "introspectable" and
   * generate more accurate results.  When it's off, the plugin code should be
   * more tolerant to "issues" in the project and defaults to noops when it
   * can't make a decision.
   *
   * This distinction is useful to make sure Pipelinit provides a good
   * experience regardless of the environment:
   * If the user is in a context where they can quickly change the project and
   * run Pipelinit again, the strict mode is preferred. However, if the user
   * can't change the project and get immediate results, like in the online
   * playground, it shouldn't use the strict mode.
   */
  strict: boolean;
  version: string;
};

export type IntrospectFn<T> = (context: Context) => Promise<T>;

export type Introspector<T> = {
  detect: (context: Context) => Promise<boolean>;
  introspect: IntrospectFn<T>;
};

export interface RenderedTemplate {
  name: string;
  content: string;
}

interface CiConfigurationFile {
  path: string;
  content: string;
}

export type PlatformWriterFn = (
  context: Context,
  templates: AsyncIterableIterator<RenderedTemplate>,
) => Promise<Array<CiConfigurationFile>>;
