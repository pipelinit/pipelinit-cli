# Pipelinit

Bootstrap and manage CI pipelines.

## How to use

Run pipelinit in your project root.

If the project isn't initialized, it asks what CI platform you use.

After the asnwer (or if the project is initialized) it:

1. Detects what programming languages and tools it uses (stacks)
2. Creates CI pipelines configuration files for your project

## Building

Pipelinit is built with Deno. To build the project from source, make sure you
have Deno installed. You can check how to install it
[in the official Deno website](https://deno.land/#installation)

Run the following command:

```
deno run --unstable --allow-read --allow-write --allow-net --allow-env --allow-run build.ts
```

It creates the executable at `bin/pipelinit`.
