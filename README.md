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

## Supported Stacks and Platforms

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
      <td rowspan="7">Coming soon</td>
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

### CSS Support

#### Package Managers

- [npm](https://www.npmjs.com/)
- [yarn](https://yarnpkg.com/)

#### Flavors

- CSS
- [Sass](https://sass-lang.com/)
- [Less](https://lesscss.org/)

#### Tools

| Stage  |  Tools |
| -----  | ------ |
| Format | [Prettier](https://prettier.io/) |
| Lint   | [stylelint](https://stylelint.io/) |

### JavaScript Support

#### Package Managers

- [npm](https://www.npmjs.com/)
- [yarn](https://yarnpkg.com/)

#### Flavors

- JavaScript
- [TypeScript](https://www.typescriptlang.org/)

#### Runtime

- [Node.js](https://nodejs.org/)
- [Deno](https://deno.land/)

#### Tools

| Stage  | Tools |
| -----  | ----- |
| Format | [Prettier](https://prettier.io/), [Deno](https://deno.land/manual@v1.13.1/tools/formatter) |
| Lint   | [ESLint](https://eslint.org/), [Deno](https://deno.land/manual@v1.13.1/tools/linter) |
| Test   | [Deno](https://deno.land/manual@v1.13.1/testing) |

### Python

#### Tools

| Stage  | Tools |
| -----  | ----- |
| Lint   | [Flake8](https://flake8.pycqa.org/) |

## Building

Pipelinit is built with Deno. To build the project from source, make sure you
have Deno installed. You can check how to install it
[in the official Deno website](https://deno.land/#installation)

Run the following command:

```
deno run --unstable --allow-read --allow-write --allow-net --allow-env --allow-run build.ts
```

It creates the executable at `bin/pipelinit`.
