# Creating a plugin for Markdown

In this tutorial we'll write a new plugin to Pipelinit detect that a project
uses Markdown and generate a GitHub Action workflow file that lints Markdown
files changed by a Pull Request.

## Getting Started

Pipelinit is built with Deno. If you don't have it installed, check how to get
it [on the official Deno website](https://deno.land/#installation).

Checkout the Pipelinit repository in your computer and install Pipelinit with
Deno script installer:
```
deno install -A -f --unstable cli/pipelinit.ts
```

You should see the following message in your terminal:
```
✅ Successfully installed pipelinit
```

## Pick a test project

Pipelinit runs in the root of software projects that could have a CI pipeline.
If you already have a repository with some Markdown files you're ready to go!

Otherwise, [create a repository on GitHub](https://github.com/new), it doesn't
matter if its private or public. Include at least one Markdown file there,
commit it and push it. How about a README.md?

## Create the Introspector

Now it's time to start coding! Open Pipelinit source code in your favorite code
editor and create a new directory at `core/plugins/stack/markdown`. The new
Markdown plugin will live there.

Create a `mod.ts` file with the following content:
```typescript
import { Introspector } from "../../../types.ts";

/**
 * Introspected information about a project with Markdown
 */
export default interface MarkdownProject {}

export const introspector: Introspector<MarkdownProject> = {
  detect: async (context) => {
    return false;
  },
  introspect: async (context) => {
    return {};
  },
};
```

It doesn't do anything yet, but the basic shape of the plugin is there. We need
to implement a `detect` function that returns true if the analyzed project has
any Markdown files and an `introspect` function, that must return a
`MarkdownProject` object.

The data returned by the `introspect` function becomes available to the
template that generates the CI files later. We don't really need any specific
information from the Markdown files, therefore the `introspect` function can
return an empty object.

Let's implement the detection phase, we simply need to check if there is any
`.md` files in the project. The `context` object has some handy helpers to
manipulate files, one of them is the `files.includes` function, that receives
a "glob" and returns true if there is any file that matches that glob. We can
implement the detect function like this:

```typescript
export const introspector: Introspector<MarkdownProject> = {
  detect: async (context) => {
    return await context.files.includes("**/*.md");;
  },
  introspect: async (context) => {
    return {};
  },
};
```

Now let's register this new plugin to check if it works!

## Registering the new plugin

Open the file `core/plugins/stack/mod.ts`. You'll se a bunch of import
statements and some objects structure using the imported objects and types.
You need to include your new Introspector there.

Please keep everything lexicographically sorted!

Add the imports in the beginning of the file:
```typescript
// (...)
import { introspector as MarkdownIntrospector } from "./markdown/mod.ts";
// (...)

// (...)
import type MarkdownProject from "./python/mod.ts";
// (...)
```

Update the `ProjectData` type definition:
```typescript
export type ProjectData =
  // (...)
  | MarkdownProject
  // (...)
```

And the `introspectors` list:
```typescript
export const introspectors = [
  // (...)
  { name: "markdown", ...MarkdownIntrospector },
  // (...)
];
```

Save the file.

Run `pipelinit` in your test project, you should see the following message in
the output:
```
Loading project configuration
Detecting stack...
Detected stack: (...), markdown
```

It worked!

## Generating the CI files

Ok, the plugin detected a Markdown file in the repository, but it still doesn't
do anything with that information. Let's include a new template file to build
a `lint` stage for Markdown files in projects that uses GitHub Actions Workflow.

Create the directory `core/plugins/templates/github/markdown`. Create a
`lint.yml` file inside this new directory with the following content:
```yaml
name: Lint Markdown
on:
  pull_request:
    paths:
      - '**.md'
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: echo "Lint markdown files!"
```

Run `pipelinit` in your test project again, you should see something new in
the output:
```
Loading project configuration
Detecting stack...
Detected stack: (...), markdown
(...)
Writing .github/workflows/pipelinit.markdown.lint.yaml
```

And if you open the file `.github/workflows/pipelinit.markdown.lint.yaml` the
content from `core/plugins/templates/github/markdown/lint.yml` will be there!

## Linting Markdown

Now the plugin detects if a project has any Markdown files and generates a CI
file for that. All that is left is to add the proper tools to lint the Markdown
files in the CI pipeline. We'll use [markdown-cli](https://github.com/igorshubovych/markdownlint-cli) for that.

Reading the docs, it's possible to find out how to install and how to use the
tool. Let's remove the placeholder echo from before and put the real commands:
```patch
     runs-on: ubuntu-latest
     steps:
       - uses: actions/checkout@v2
-      - run: echo "Lint markdown files!"
+      - run: npm install -g markdownlint-cli
+      - run: markdownlint '**/*.md'
```

Run `pipelinit` in your test project again, the CI file that lints Markdown
files now should be updated.

## Testing the generated CI

To wrap up, test if the generated files actually works in the CI system. Push
the new files to the test project. Change some Markdown files in a new branch
and open a PR.

If GitHub started a new workflow run for that PR your plugin worked!
