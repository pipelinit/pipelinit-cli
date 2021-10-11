import { context } from "../../../tests/mod.ts";
import { assertEquals, deepMerge } from "../../../deps.ts";
import { FileEntry } from "../../../types.ts";

import { introspector } from "./mod.ts";

const fakeContext = (
  {
    isDjango = false,
    hasPytest = false,
    isPoetry = false,
    isPipenv = false,
    isRequirements = false,
  } = {},
) => {
  return deepMerge(
    context,
    {
      files: {
        // deno-lint-ignore require-await
        includes: async (glob: string): Promise<boolean> => {
          if (glob === "**/*.py") {
            return true;
          }
          if (glob === "**/manage.py" && isDjango) {
            return true;
          }
          if (glob === "**/poetry.lock" && isPoetry) {
            return true;
          }
          if (glob === "**/Pipfile.lock" && isPipenv) {
            return true;
          }
          if (glob === "**/requirements.txt" && isRequirements) {
            return true;
          }
          return false;
        },
        each: async function* (glob: string): AsyncIterableIterator<FileEntry> {
          if (glob === "**/.python-version") {
            yield {
              name: ".python-version",
              path: "fake-path-root",
            };
          }
          if (glob === "**/Pipfile" && isPipenv) {
            yield {
              name: "Pipfile",
              path: "fake-path",
            };
          }
          if (glob === "**/pyproject.toml" && isPoetry) {
            yield {
              name: "pyproject.toml",
              path: "fake-path",
            };
          }
          if (glob === "**/requirements.txt" && isRequirements) {
            yield {
              name: "requirements.txt",
              path: "fake-path",
            };
          }
          return;
        },
        // deno-lint-ignore require-await
        readToml: async (path: string): Promise<Record<string, unknown>> => {
          if (path === "fake-path") {
            if (isPipenv) {
              const dep = {
                requires: { python_version: "3.6" },
                packages: {},
                "dev-packages": {},
              };
              if (isDjango) {
                dep.packages = { django: "2.0.9" };
              }
              if (hasPytest) {
                dep["dev-packages"] = { pytest: "2" };
              }
              return dep;
            }
            if (isPoetry) {
              const dep = {
                tool: {
                  poetry: {
                    dependencies: {},
                    "dev-packages": {},
                  },
                },
              };
              if (isDjango) {
                dep.tool.poetry.dependencies = { django: "2.0.9" };
              }
              if (hasPytest) {
                dep.tool.poetry["dev-packages"] = { pytest: "2" };
              }
              return dep;
            }
          }

          return {};
        },
        // deno-lint-ignore require-await
        readText: async (path: string) => {
          if (path === "fake-path-root") {
            return "3.6";
          }
          if (path === "fake-path") {
            if (isRequirements) {
              let dep = "dep == 0.1.0";
              if (isDjango) {
                dep += "\ndjango == 2.0.9";
              }
              if (hasPytest) {
                dep += "\npytest == 2";
              }
              return dep;
            }
          }
          return "";
        },
      },
    },
  );
};

Deno.test("Plugins > Check if python version and django project is identified PIPENV", async () => {
  const result = await introspector.introspect(
    fakeContext({
      isDjango: true,
      isPipenv: true,
    }),
  );

  assertEquals(result, {
    version: "3.6",
    formatters: {
      black: {
        isDependency: false,
        name: "black",
      },
      isort: {
        isDependency: false,
        name: "isort",
      },
    },
    frameworks: {
      django: {},
    },
    hasPytest: false,
    linters: {
      flake8: {
        isDependency: false,
        name: "flake8",
      },
    },
    packageManager: {
      name: "pipenv",
      commands: {
        install: "python -m pip install pipenv; pipenv install --dev",
        run: "pipenv run",
      },
    },
    type: "webApp",
  });
});

Deno.test("Plugins > Check if python version and a non-django-project PIPENV", async () => {
  const result = await introspector.introspect(
    fakeContext({ isDjango: false, isPipenv: true }),
  );

  assertEquals(result, {
    version: "3.6",
    formatters: {
      black: {
        isDependency: false,
        name: "black",
      },
      isort: {
        isDependency: false,
        name: "isort",
      },
    },
    frameworks: {},
    hasPytest: false,
    linters: {
      flake8: {
        isDependency: false,
        name: "flake8",
      },
    },
    packageManager: {
      name: "pipenv",
      commands: {
        install: "python -m pip install pipenv; pipenv install --dev",
        run: "pipenv run",
      },
    },
    type: null,
  });
});

Deno.test("Plugins > Check if python version and django project is identified POETRY", async () => {
  const result = await introspector.introspect(
    fakeContext({
      isDjango: true,
      isPoetry: true,
    }),
  );

  assertEquals(result, {
    version: "3.6",
    formatters: {
      black: {
        isDependency: false,
        name: "black",
      },
      isort: {
        isDependency: false,
        name: "isort",
      },
    },
    frameworks: {
      django: {},
    },
    hasPytest: false,
    linters: {
      flake8: {
        isDependency: false,
        name: "flake8",
      },
    },
    packageManager: {
      name: "poetry",
      commands: {
        install: "python -m pip install poetry; poetry install",
        run: "poetry run",
      },
    },
    type: "webApp",
  });
});

Deno.test("Plugins > Check if python version and a non-django-project POETRY", async () => {
  const result = await introspector.introspect(
    fakeContext({ isDjango: false, isPoetry: true }),
  );

  assertEquals(result, {
    version: "3.6",
    formatters: {
      black: {
        isDependency: false,
        name: "black",
      },
      isort: {
        isDependency: false,
        name: "isort",
      },
    },
    frameworks: {},
    hasPytest: false,
    linters: {
      flake8: {
        isDependency: false,
        name: "flake8",
      },
    },
    packageManager: {
      name: "poetry",
      commands: {
        install: "python -m pip install poetry; poetry install",
        run: "poetry run",
      },
    },
    type: null,
  });
});

Deno.test("Plugins > Check if python version and django project is identified REQ", async () => {
  const result = await introspector.introspect(
    fakeContext({
      isDjango: true,
      isRequirements: true,
    }),
  );

  assertEquals(result, {
    version: "3.6",
    formatters: {
      black: {
        isDependency: false,
        name: "black",
      },
      isort: {
        isDependency: false,
        name: "isort",
      },
    },
    frameworks: {
      django: {},
    },
    hasPytest: false,
    linters: {
      flake8: {
        isDependency: false,
        name: "flake8",
      },
    },
    packageManager: {
      name: "pip",
      commands: {
        install: "pip install -r requirements.txt",
        run: "",
      },
    },
    type: "webApp",
  });
});

Deno.test("Plugins > Check if python version and a non-django-project REQ", async () => {
  const result = await introspector.introspect(
    fakeContext({ isDjango: false, isRequirements: true }),
  );

  assertEquals(result, {
    version: "3.6",
    formatters: {
      black: {
        isDependency: false,
        name: "black",
      },
      isort: {
        isDependency: false,
        name: "isort",
      },
    },
    frameworks: {},
    hasPytest: false,
    linters: {
      flake8: {
        isDependency: false,
        name: "flake8",
      },
    },
    packageManager: {
      name: "pip",
      commands: {
        install: "pip install -r requirements.txt",
        run: "",
      },
    },
    type: null,
  });
});
