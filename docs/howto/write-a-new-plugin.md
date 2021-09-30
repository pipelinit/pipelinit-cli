# How to write a stack plugin

A Stack Plugin does two things:
* detect: answers if the stack is present in the project
* introspect: collects data for that stack. The data collected is available to render templates.

The directory structure for the Introspectors follows:

```
└── stack
    ├── stack1
    │   ├── mod.ts
    │   └── introspector1.ts
    └── stack2
        └── mod.ts
        └── introspector1.ts
```

Each stack has a `mod.ts` that run a `detect` and `introspect` function. The `introspect` function call other introspectors to collect all project data.

You can see the implemented stacks [here](https://github.com/pipelinit/pipelinit-cli/tree/main/core/plugins/stack)

Adding a new stack means improving the compatibility of Pipelinit with diverse technologies and different project patterns.


#### Introspector

Pipelinit runs an `introspector` through the files of the analyzed project and determines the project stack and its configurations.

For example, the implemented python introspector do as follows:
  - Find in the analyzed project any files ending with '.py';
    - If founds we use another introspector to find out more information about the project, like the Python version and if it belongs to some framework (Django, Flask?);
    - If not, it just skips this stack.

You can see the comments examples here:
* [Python Introspector](https://github.com/pipelinit/pipelinit-cli/blob/main/core/plugins/stack/python/mod.ts)
   * [Python Version Introspector](https://github.com/pipelinit/pipelinit-cli/blob/main/core/plugins/stack/python/version.ts)
   * [Django Introspector](https://github.com/pipelinit/pipelinit-cli/blob/main/core/plugins/stack/python/django.ts)

All the data collected from these chains of introspections will be available on the stack template.

#### Template

The Builtin Templates are a collection of YAMLs (or other formats, depending on the CI Platform) that uses the data collected from the Stack Plugin and uses a Template Engine syntax to compose the adequate configuration string.

The directory structure for the Builtin Templates follows:

```
└── ci-platform
    ├── stack1
    │   ├── lint.yaml
    │   └── test.yaml
    └── stack2
        └── lint.yaml
```

You can see the implemented stacks [here](https://github.com/pipelinit/pipelinit-cli/tree/main/core/templates/github)

Here’s a simple template that uses the collected python version to render a CI configuration:

```yml
name: Lint Python
on:
  pull_request:
    paths:
      - "**.py"
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Set up Python
        uses: actions/setup-python@v2
        with:
          python-version: <%= it.version %>
      - run: python -m pip install pip flake8 black
      - run: black . --check
      # Adapts Flake8 to run with the Black formatter, using the '--ignore' flag to skip incompatibilities errors
      # Reference: https://black.readthedocs.io/en/stable/guides/using_black_with_other_tools.html?highlight=other%20tools#id1
      - run: flake8 --ignore E203,E501,W503 .
```

#### Implementation (GitHub Actions)

With these core concepts in mind, you can guide yourself with these steps

##### Choose a project with a stack you have in mind

These current supported Pipelinit plugin support https://github.com/pipelinit/pipelinit-cli#support-overview

##### Write a template for the determined stage(lint, test, build)
Define a name and the glob that will trigger this CI

```yml
name: Lint Python
on:
  pull_request:
        paths:
          - "**.py"
```
On the ‘jobs’ declare the stages and where it will run:
```yml
jobs:
  lint:
        runs-on: ubuntu-latest
```
 Inside the stage, declare the other GitHub actions you can use to set up the environment, on the Python Lint stage for example we use the action actions/setup-python@v2, and we pass as parameter an introspected value of the project python version
```yml
          - uses: actions/checkout@v2
          - name: Set up Python
            uses: actions/setup-python@v2
            with:
              python-version: <%= it.version %>
```


After setting up the environment just runs the commands according to the Python Lint stage was the flake8 and black command line
```yml
          - run: python -m pip install pip flake8 black
          - run: black . --check
          # Adapts Flake8 to run with the Black formatter, using the '--ignore' flag to skip incompatibilities errors
          # Reference: https://black.readthedocs.io/en/stable/guides/using_black_with_other_tools.html?highlight=other%20tools#id1
          - run: flake8 --ignore E203,E501,W503 .
```

##### Following the template, start writing the introspector to collect data

First define a interface with data the template can use
```typescript
/**
 * Introspected information about a project with Python
 */
export default interface PythonProject {
  /**
   * Python version
   */
  version?: string;
  /**
   * If is a Django project
   */
  isDjango?: boolean;
}
```


Then you can start implementing the IntrospectFn function, you need to define a detect and a introspect function.
Here we’re using the python stack, to start the introspection for this stack we search any .py file.
```typescript
const ERR_UNDETECTABLE_TITLE =
  "Couldn't detect which Python version this project uses.";
const ERR_UNDETECTABLE_INSTRUCTIONS = `
To fix this issue, consider one of the following suggestions:`
export const introspector: Introspector<PythonProject | undefined> = {
  detect: async (context) => {
        return await context.files.includes("**/*.py");
  },
  introspect: async (context) => { … },
};
```

Create the introspectors for the data you need to collect
```typescript
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

The introspect function call the necessary introspectors and collect provide all this stack collected data to the template

```typescript
import { Introspector } from "../../../types.ts";
import { introspect as introspectVersion } from "./version.ts";
import { introspect as introspectDjango } from "./django.ts";


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
  },
```
##### Run a local build of the Pipelinit CLI in the root of your project
Run the command:

```deno install -f --unstable --allow-read=.,$(pwd) --allow-write=. cli/pipelinit.ts```

##### Push the project and test the generated workflow.

To test create a new GitHub repository, it can be private or public push your changes into a branch with changes on the files that triggers a build(see the template pull glob).


By default, the Pipeline starts soon as the Pull Request is opened.
