# Detailed stack support

When one of the supported tools can't be detected, pipelinit generates a
pipeline configuration with the tool marked as _default_. If your project
doesn't use one of those tools with custom configurations, the pipeline
generated uses _sensible defaults_ from the picked tools.

If this isn't desired, you can disable this with the flag `--no-default-stage`.

## CSS

### Package Managers

- [npm](https://www.npmjs.com/) _default_
- [yarn](https://yarnpkg.com/)

### Flavors

- CSS
- [Sass](https://sass-lang.com/)
- [Less](https://lesscss.org/)

### Tools

| Stage  | Tools                                          |
| ------ | ---------------------------------------------- |
| Format | [Prettier](https://prettier.io/) (_default_)   |
| Lint   | [stylelint](https://stylelint.io/) (_default_) |

## Docker

### Tools

| Stage  | Tools                                            |
| ------ | ------------------------------------------------ |
| Lint   | [hadolint](https://github.com/hadolint/hadolint) |

## HTML

### Package Managers

- [npm](https://www.npmjs.com/) _default_
- [yarn](https://yarnpkg.com/)

### Flavors

- HTML
- [Vue](https://v3.vuejs.org/guide/single-file-component.html)

### Tools

| Stage  | Tools                                                                         |
| ------ | ----------------------------------------------------------------------------- |
| Format | [Prettier](https://prettier.io/) (_default_)                                  |
| Lint   | [ESLint](https://eslint.org/) (_default_), [stylelint](https://stylelint.io/) |

## Java

### Tools

| Stage  | Tools                         |
| ------ | ----------------------------- |
| Build  | [Gradle](https://gradle.org/) |

## JavaScript

### Package Managers

- [npm](https://www.npmjs.com/) _default_
- [yarn](https://yarnpkg.com/)

### Flavors

- JavaScript _default_
- [TypeScript](https://www.typescriptlang.org/)

### Runtime

- [Node.js](https://nodejs.org/) _default_
- [Deno](https://deno.land/)

### Tools

| Stage  | Tools                                                                                                  |
| ------ | ------------------------------------------------------------------------------------------------------ |
| Format | [Prettier](https://prettier.io/) (_default_), [Deno](https://deno.land/manual@v1.13.1/tools/formatter) |
| Lint   | [ESLint](https://eslint.org/) (_default_), [Deno](https://deno.land/manual@v1.13.1/tools/linter)       |
| Test   | [Deno](https://deno.land/manual@v1.13.1/testing)                                                       |

## Python

### Tools

| Stage  | Tools                                                      |
| ------ | ---------------------------------------------------------- |
| Lint   | [Flake8](https://flake8.pycqa.org/) _default_              |
| Format | [Black](https://black.readthedocs.io/en/stable/) _default_ |

## Shell script

### Tools

| Stage  | Tools                                     |
| ------ | ----------------------------------------- |
| Lint   | [ShellCheck](https://www.shellcheck.net/) |
