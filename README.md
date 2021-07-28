# Pipelinit

Bootstrap and manage CI pipelines.

## How to use

Run pipelinit in your project root.

It tries to detect two aspects from your project:

- Which CI/CD platform it's using or what platform is available
- What programming languages and tools it uses

With this information pipelinit generates files to configure a CI pipeline for
your project.

## Install

pipelinit requires Deno to run, you can check how to install it
[in the official Deno website](https://deno.land/#installation).

After installing Deno, install pipelinit with:

```
deno install --unstable --allow-read --allow-write --allow-net ./pipelinit.ts
```

Run `pipelinit --version` to test it.
