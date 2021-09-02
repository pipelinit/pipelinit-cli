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
  files: {
    each(glob: string): AsyncIterableIterator<FileEntry>;
    includes(glob: string): Promise<boolean>;
    readLines(path: string): AsyncIterableIterator<string>;
    readToml(path: string): Promise<any>;
    readJSON(path: string): Promise<any>;
  };
  errors: {
    add(error: IntrospectionError): void;
  };
  semver: SemVerHelpers;
  suggestDefault: boolean;
  version: string;
};
