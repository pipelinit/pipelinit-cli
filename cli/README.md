# Pipelinit CLI

Here is the code for the Pipelinit CLI, to learn more about the project, read
the [README in the project root](../README.md).

## Developmenting and contributing

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

### Docker

To build the Docker image, run the following command in the project root:
```
docker build -t pipelinit -f cli/Dockerfile .
```

This build a local image tagged as `pipelinit:latest` that you can use with:
```
docker run -it -v $(pwd):/workdir pipelinit:latest
```
