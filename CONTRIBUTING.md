# Contributing to this repository

Thank you for your interest in contributing to pipelinit!

## Getting Started

Before you begin:

1. Make sure you have Deno installed, see Requirements
2. Read the [code of conduct](CODE_OF_CONDUCT.md)
3. Read Types of contributions to learn how to contribute

## Requirements

pipelinit is built with Deno, you can check how to install it
[in the official Deno website](https://deno.land/#installation).

## Running tests

Run tests with
```
deno --unstable test --coverage=cov_profile
```

## Types of contributions

### Template plugin

A CI template plugin is an ES module. It must have a default export that is
an object with some required properties:

|name|type|description|
|----|----|----------|
|id  |string|An unique ID to identify the piece of pipeline. This ID may determine the file name used in the final output.|
|platform|string|Identifies the CI/CD platform. Each plugin generates output for one and only one CI/CD platform.
|glob|string|a glob pattern to search for files in the repository. This is useful to determine how the plugin introspects the source code.
|process|async function|This function receives an AsyncIterableIterator of FileEntry as argument and must return either a string or null. Each FileEntry represents one file discovered by the glob pattern, and can be further analyzed by the plugin code. If the function returns null, it means that this plugin doesn't apply for the discovered files. Otherwise the plugin returns a string with the proper CI configuration.

You can read existing plugins at `plugins/templates`. Check an example below:

```ts
import { FileEntry, Template } from "../../../mod.ts";

const plugin: Template = {
  id: "pipelinit.sast-python",
  platform: "GITHUB",
  glob: "**/*.py",
  async process(
    files: AsyncIterableIterator<FileEntry>,
  ): Promise<string | null> {
    // Process detected .py files here
    // (...)
    // return a string with the CI configuration
    // or return null if this plugin doesn't apply
  },
};

export default plugin;
```


