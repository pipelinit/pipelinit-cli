# Code Style Guide

## DX (template writing):

### Boolean attributes should start with is or has

The attributes will be used in the template, so it is necessary that they are as clear as possible, facilitating the template writing.

Example:
```typescript
export default interface DockerProject {
  hasDockerImage: true;
}
```

### Use empty interfaces for backward compatibility

Prefer empty interfaces for attributes that can grow in the future

Bad:
```typescript
export type Linters = {
  eslint?: ESLint | null;
  stylelint?: Stylelint | null;
  deno?: null;  // <------
} | null;
```

Good:
```typescript
interface Deno {} // <-----


export type Linters = {
  eslint?: ESLint | null;
  stylelint?: Stylelint | null;
  deno?: Deno; // <-----
} | null;
```

### Use shortcuts for commands

Join shortcuts to tool commands into a "commands" object

Bad:
```typescript
interface Npm {
  name: "npm";
}
```

```typescript
<%_ let installCmd; -%>
<%_ if (it.packageManager.name === "npm") { -%>
  <%_ installCmd = "npm ci" %>
<%_ } else { -%>
  <%_ installCmd = "yarn" %>
<% } -%>
- run: <%= installCmd %>
```


Good:
```typescript
interface Npm {
  name: "npm";
  commands: {
        install: "npm ci";
  };
}
```

```
 - run: <%= it.packageManager.commands.install %> // <-------
```

Use shortcuts for commands **only if it reduces template complexity**

## UX:

### Suggest default tool if you don't find one supported

By default, the Pipelinit CLI is set to suggest tools for the detected stacks, and don't forget to put a warning to make clear to the user that it is a suggestion.


Example:
```typescript
if (context.suggestDefault) { // <-------
  logger.warning("No JavaScript formatter detected, using Prettier"); // <-------
  return {
        prettier: { name: "prettier", hasIgnoreFile: false },
  };
}
```

## Organization / maintainability:

### Break introspection into steps with IntrospectFn

To improve the organization and facilitate the maintenance of the project, break the introspection in multiples introspection

Bad:
```typescript
introspect: async (context) => {
  const logger = context.getLogger("python");


  // Version
  logger.debug("detecting version");
  let version = String()
  for await (const file of context.files.each("**/Pipfile")) {
        const pipfile = await context.files.readToml(file.path);
        version = pipfile?.requires?.python_version;
  }
  logger.debug(`detected version ${version}`);


  // Django
  const django = await context.files.includes("**/manage.py");
  if (django) {
        logger.debug("detected Django project");
  }
  return {
        version: version,
        isDjango: django,
  };
}
```

Good:
```typescript
introspect: async (context) => {
  const logger = context.getLogger("python");


  // Version
  logger.debug("detecting version");
  const version = await introspectVersion(context);
  if (version === undefined) {
        logger.debug("didn't detect the version");
        return undefined;
  }
  logger.debug(`detected version ${version}`);


  // Django
  const django = await introspectDjango(context);
  if (django) {
        logger.debug("detected Django project");
  }
  return {
        version: version,
        isDjango: django,
  };
}
```
```typescript
export const introspect: IntrospectFn<boolean> = async (context) => { // <------
  // Search for project manage.py to define as a Django project
  return await context.files.includes("**/manage.py");
};
```

### If an IntrospectFn function is useful for more than one stack, put it in _shared

Pipelinit is designed to use a lot of introspectors to make the project manageable and interlinked, use the _shared folder in case your implementation is used multiple times.

Currently, there are already some shared introspectors you can use, they are:
* Node Package Manager
* ESlint
* Prettier
* StyleLint

### Keep the implementation simple

Pipelinit plugins will always be open to receive changes and contributions, with that in mind always keep the code as simple as possible thus making it easier for everyone to develop.

### Generating an error recommending changes to the project to make it introspectable is ok

There are some projects that Pipelinit will introspect which the stack will not be rightfully configured, in these cases use an error message with recommendation of good practices for the determined stack.

On the Python stack, when Pipelinit does not detect any defined python version it show an error message indicating how configure the project accordingly as follows:

```typescript
import { IntrospectFn } from "../../../types.ts";


const ERR_UNDETECTABLE_TITLE =
  "Couldn't detect which Python version this project uses.";
const ERR_UNDETECTABLE_INSTRUCTIONS = `
To fix this issue, consider one of the following suggestions:


1. Adopt Pipenv


Pipenv is a tool, which is maintaned by the Python Packaging Authority, that
manages project dependencies, a local virtualenv, split dependencies between
development and production, and declares what is the Python version used in
the project.


See https://pipenv.pypa.io/


2. Adopt Poetry


Poetry is a popular alternative to Pipenv, it solves similar problems and helps
to build and publish Python packages. It also declares what Python version a
project is using.


See https://python-poetry.org/


3. Create a .python-version file


The .python-version file is used by pyenv to choose a specific Python version
for a project.


Its the easiest option, all you have to do is create a .python-version text
file with a version inside, like "3.9".


See https://github.com/pyenv/pyenv
`;


export const introspect: IntrospectFn<string | undefined> = async (context) => {
  // Search for application specific `.python-version` file from pyenv
  //
  // See https://github.com/pyenv/pyenv/#choosing-the-python-version
  for await (const file of context.files.each("**/.python-version")) {
        return await context.files.readText(file.path);
  }


  // Search a Pipfile file, that have a key with the Python version, as managed
  // by pipenv
  //
  // See https://pipenv.pypa.io/en/latest/basics/#specifying-versions-of-python
  for await (const file of context.files.each("**/Pipfile")) {
        const pipfile = await context.files.readToml(file.path);
        const version = pipfile?.requires?.python_version;
        if (version) return version;
  }


  // Search a pyproject.toml file. If the project uses Poetry, it has a key
  // with the Python version
  //
  // See https://python-poetry.org/docs/pyproject/#dependencies-and-dev-dependencies
  for await (const file of context.files.each("**/pyproject.toml")) {
        const pyproject = await context.files.readToml(file.path);
        const version: string | null = pyproject?.tool?.poetry?.dependencies
          ?.python;
        if (version) {
          // FIXME this simply removes caret and tilde from version specification
          // to convert something like "^3.6" to "3.6". The correct behavior
          // would be to convert it to a range with 3.6, 3.7, 3.8 and 3.9
          return version.replace(/[\^~]/, "");
        }
  }


  context.errors.add({
        title: ERR_UNDETECTABLE_TITLE,
        message: ERR_UNDETECTABLE_INSTRUCTIONS,
  });
};
```

### Developing tests

Create a function that generates false context and takes an argument with options

```typescript
const fakeContext = (
  {
        withStylelint = true,
        devDependencies = true,
  } = {},
) => {
  return deepMerge(
        context,
        {
          files: {
            each: async function* (glob: string): AsyncIterableIterator<FileEntry> {
              if (glob === "**/package.json") {
                yield {
                  name: "package.json",
                  path: "fake-path",
                };
              }
              return;
            },
            // deno-lint-ignore require-await
            readJSON: async (path: string): Promise<Record<string, unknown>> => {
              const deps = { stylelint: "1.0.0" };
              if (!withStylelint) return {};
              if (path === "fake-path") {
                return devDependencies
                  ? { devDependencies: deps }
                  : { dependencies: deps };
              }
              return {};
            },
          },
        },
  );
};
```


Then create test cases that generate the context, and test the result for that context
```typescript
Deno.test("Plugins > _shared > Stylelint - at devDependecies", async () => {
  const result = await introspect(fakeContext());
  assertEquals(result, { name: "stylelint" });
});


Deno.test("Plugins > _shared > Stylelint - at dependecies", async () => {
  const result = await introspect(fakeContext({ devDependencies: false }));
  assertEquals(result, { name: "stylelint" });
});


Deno.test("Plugins > _shared > Stylelint - not present", async () => {
  const result = await introspect(fakeContext({ withStylelint: false }));
  assertEquals(result, null);
});
```


### Use debug logs with the stack name for each introspected property

When using an introspector inside a stack, always use the logger with the stack name.


Example:
```typescript
export const introspect: IntrospectFn<Prettier | null> = async (context) => {
  const logger = context.getLogger("javascript");
```

## Portability:

### Plugin code should not do I/O operations directly, only through context-provided helpers

The IntrospectFn function comes with a context object that has several helpers and performs IO calls for the plugin. To illustrate this better, take a look at the following example:


```typescript
const introspect: IntrospectFn<IntrospectedData> = async (context) => {  (1)
  for await (const file of context.files.each("**/package.json")) {          (2)
        const packageJson = await context.files.readJSON(file.path);             (3)
        // Further process of the package.json file
```
In the preceding example, the introspect variable implements the IntrospectFn interface, enforcing it to be a function that receives the context object.  The context object received in the function at line 1 injects some runtime specific helpers, in this example: one to iterate through each file that matches the glob at line 2 and the other to read a JSON file at line 3.


### Do not use any dependencies, just for testing

As explained above, the Plugin implementation uses a Dependency Injection so the ‘context’ object contains all the necessary helpers to implement the plugin, this helps our build and set a default structure for the stack implementations.

For tests, you can see the dependencies here: https://github.com/pipelinit/pipelinit-cli/blob/main/core/deps.ts

## Performance:

### Interpret the content of coded files should be used as a last resort

Keep in mind that Pipelinit has multiples introspectors collecting a project data, read the content of files is an expensive operation that will not scale being used in multiple plugins and can cause a performance problem. On the implementation, to determine a stack or a tool generally just reading a specific file is enough to confirm it.


Example:
```typescript
export type NodePackageManager = Npm | Yarn;


export const introspect: IntrospectFn<NodePackageManager> = async (context) => {
  if (await context.files.includes("**/yarn.lock")) {
        return {
          name: "yarn",
          commands: {
            install: "yarn",
          },
        };
  }


  return {
        name: "npm",
        commands: {
          install: "npm ci",
        },
  };
};
```

### Analyze the content of configuration files with structured formats (e.g.: JSON, YAML, TOML) is ok

If necessary to read a configuration file, use structure formats and remember to use  the context object helper functions.

Example:
```typescript
  for await (const file of context.files.each("**/package.json")) {
        const packageJson = await context.files.readJSON(file.path);
        const packages = {
          ...(packageJson?.dependencies || {}),
          ...(packageJson?.devDependencies || {}),
        };
        if (hasPrettier2(packages)) {
          return {
            "name": "prettier",
            hasIgnoreFile,
          };
        }
  }
```
