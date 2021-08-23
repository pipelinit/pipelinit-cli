# Pipelinit

Bootstrap and manage **Continuous Integration (CI)** pipelines.

## How to install

Download an executable from the [Releases page](https://github.com/pipelinit/pipelinit/releases).

If you have [Deno](https://deno.land/) installed, an alternative method is the
[Script installer](https://deno.land/manual@v1.13.1/tools/script_installer):
```bash
deno install      \
  --unstable      \
  --allow-read=.  \
  --allow-write=. \
  https://raw.githubusercontent.com/pipelinit/pipelinit/v0.1.0-rc.1/pipelinit.ts
```

## How to use

In the root of a git repository run:
```
pipelinit
```
And follow the instructions.

## Concepts

To understand how Pipelinit generates CI pipelines for a software project,
first read a brief description about the following concepts:

### Stacks

A _Stack_ is a set of technologies used by a project such as programming
languages, frameworks, libraries, and tools. Pipelinit introspects a project
searching for technologies that can be checked in a CI pipeline. Those projects
traits are grouped into _Stacks_.

### CI Stage

A _Stage_ is a step, which can contain substeps, in a CI pipeline that perform
tasks with **similar goals** independent from the _stack_. Pipelinit generates
standarized CI pipelines with well-defined _stages_. The tools that each step
uses changes to fit the stack, but serve the same purpose.

Every stage uses free and open source software.

### CI Platform

A _Platform_ is a service that runs the CI pipeline, each platform has its own
set of features and therefore configuration. A CI platform may be a public
service or a self-hosted solution.

## How it works

When you run pipelinit in the root of a software project:

1. It checks what kind of files exists there to detect the _stacks_.
2. It collects more detailed data about each _stack_.
3. It uses that data to build the CI configuration files.

## Stages

Which stages are present in the final CI pipeline depends on the identified
stacks and their support. You can check a complete reference of supported tools,
stacks and which stages are available to each one further down in this document.

Here is a list of available stages and what is the goal of each one:

### Format

The format step checks if the code is properly formatted with an automated code
formatter.

This is useful for most programming languages and text files because:

- It makes the code style looks the same regardless the project
- It removes style discussions from code review
- It free developers from thinking about code style

### Lint

The lint step uses static analysis tools to improve overall code quality. It
enforces some rules in the code base and can detect bugs before execution.

This is useful for most programming languages and text files because:

- It helps building more standarized code bases, which is easier to read and maintain
- It can prevent some bugs
- It can help with deleting unused code
- It is a great tool to teach how to write better code

### SAST

The SAST (Static application security testing) step uses static analysis tools
to improve overall code security. This step is distinct from the _Lint_ step
because of the focus towards security.

One issue with SAST tools is that it may generate some false-positives,
therefore it's adoption should be done incrementally. To mitigate this, by
default Pipelinit allows this step to fail.

SAST is useful for most applications and libraries because:

- It prevents vulnerabilities early
- It improves application reliability
- It is a great tool to teach how to write safer code

### Test

The test step runs automated tests detected in the project.

The scope of this step isn't individual files, but the whole application or
library. This stage may start extra services if the application or library
requires it.

Any application or library, no matter how small the codebase or the team,
benefits from automated tests because:

- It prevents bugs from (re)appearing
- It helps to onboard new contributors
- It's required to refactor the codebase towards something better
- It documents how the software behaves

The benefits far outweight the costs.

## Stacks and Platforms

<table>
  <caption class="title">Pipelinit Support Matrix</caption>
  <colgroup>
    <col style="width: 33.3333%;">
    <col style="width: 33.3333%;">
    <col style="width: 33.3334%;">
  </colgroup>
  <thead>
    <tr>
      <th>Stack</th>
      <th>Stage</th>
      <th>GitHub</th>
      <th>GitLab</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td rowspan="2">CSS</td>
      <td>Format</td>
      <td>✔️</td>
      <td rowspan="6">Coming soon</td>
    </tr>
    <tr>
      <td>Lint</td>
      <td>✔️</td>
    </tr>
    <tr>
      <td rowspan="3">JavaScript</td>
      <td>Format</td>
      <td>✔️</td>
    </tr>
    <tr>
      <td>Lint</td>
      <td>✔️</td>
    </tr>
    <tr>
      <td>Test</td>
      <td>🟡</td>
    </tr>
    <tr>
      <td>Python</td>
      <td>Lint</td>
      <td>✔️</td>
    </tr>
  </tbody>
</table>

### Notes about partial support (cells with 🟡)

- The test stage for JavaScript currently supports Deno

## Stack support

In this section you can check details about what each stack supports.

When one of the supported tools can't be detected, pipelinit generates a
pipeline configuration with the tool marked as _default_. If your project
doesn't use one of those tools with custom configurations, the pipeline
generated uses _sensible defaults_ from the picked tools.

If this isn't desired, you can disable this with the flag `--no-default-stage`.

### CSS Support

#### Package Managers

- [npm](https://www.npmjs.com/) _default_
- [yarn](https://yarnpkg.com/)

#### Flavors

- CSS
- [Sass](https://sass-lang.com/)
- [Less](https://lesscss.org/)

#### Tools

| Stage  |  Tools |
| -----  | ------ |
| Format | [Prettier](https://prettier.io/) (_default_) |
| Lint   | [stylelint](https://stylelint.io/) (_default_) |

### JavaScript Support

#### Package Managers

- [npm](https://www.npmjs.com/) _default_
- [yarn](https://yarnpkg.com/)

#### Flavors

- JavaScript _default_
- [TypeScript](https://www.typescriptlang.org/)

#### Runtime

- [Node.js](https://nodejs.org/) _default_
- [Deno](https://deno.land/)

#### Tools

| Stage  | Tools |
| -----  | ----- |
| Format | [Prettier](https://prettier.io/) (_default_), [Deno](https://deno.land/manual@v1.13.1/tools/formatter) |
| Lint   | [ESLint](https://eslint.org/) (_default_), [Deno](https://deno.land/manual@v1.13.1/tools/linter) |
| Test   | [Deno](https://deno.land/manual@v1.13.1/testing) |

### Python

#### Tools

| Stage  | Tools |
| -----  | ----- |
| Lint   | [Flake8](https://flake8.pycqa.org/) |

## Development

Pipelinit is built with Deno. To develop, test or build the project, make sure
you have Deno installed. You can check how to install it
[in the official Deno website](https://deno.land/#installation)

### Manual testing

To quickly test the tool in your local environment, install it as a script. In
this project root run:
```
deno install      \
  --unstable      \
  --allow-read=.  \
  --allow-write=. \
  pipelinit.ts
```

When you update the code in the repository, just run "pipelinit" again in the
target project to start the CLI with the latest changes.

### Automated testing

To run the project automated tests use:
```
deno --unstable test --allow-read --coverage=cov_profile
```

And to check the test coverage use:
```
deno coverage cov_profile
```

| ⚠️ | Clear the content from cov_profile between each test run. Otherwise your coverage data may be incorrect. |
| --- | --- |

### Compiling

To generate compiled executables for Linux, Windows, and macOS, run the
following command:
```
deno run --unstable --allow-read --allow-write --allow-net --allow-env --allow-run build.ts
```

This creates one executable per target with the following name pattern:
```
pipelinit-<VERSION>-<TARGET>
```

And the correspondent compressed file:

- .tar.gz for Linux and macOS
- .zip for Widnows

It also generates one executable named just "pipelinit", that uses the native
target (the computer where you ran the build).

The build script puts those files in the "bin" directory.
