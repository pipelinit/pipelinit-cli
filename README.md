<p align="center">
  <a href="https://pipelinit.com">
    <img src="pipelinit-logo.png" />
  </a>
</p>

<p align="center">
  <a href="https://github.com/pipelinit/pipelinit-cli/">
    <img src="https://img.shields.io/github/license/pipelinit/pipelinit-cli" />
  </a>
  <a href="https://github.com/pipelinit/pipelinit-cli/releases">
    <img src="https://img.shields.io/github/v/release/pipelinit/pipelinit-cli?sort=semver" alt="GitHub release (latest SemVer)">
  </a>
  <a href="https://twitter.com/pipelinit">
    <img src="https://img.shields.io/twitter/follow/pipelinit?style=social" alt="Twitter Follow">
  </a>
</p>

> Automatically create complete pipelines for your project

Say goodbye to YAML!

Pipelinit detects the stack of your project and automatically creates a fully
working pipeline configuration for multiple continous integration (CI) platforms
(currently supporting GitHub Actions).

Start by using the [Pipelinit Playgroud](https://pipelinit.com/playground) right
on your browser! 🚀

## How to install

### Using a Docker image

Run the command below inside a checkout of your project's source code:

```
docker run -it -v $(pwd):/app ghcr.io/pipelinit/pipelinit-cli
```

### Using package managers

Homebrew (macOS):

```
brew tap pipelinit/pipelinit-cli
brew install pipelinit/pipelinit-cli
```

Support for more package managers needed!

### Manual download

Download one of the executables from the
[Releases page](https://github.com/pipelinit/pipelinit-cli/releases) and add the
binary into your `PATH`.

We provide binaries for Linux, Windows and Mac.

## How to use

Just run `pipelinit` on the root of your project's source code and follow the
instructions:

```
pipelinit
```

### Examples

You can see the generated pipelines that ran, through our sample projects for
the following stacks:

- [Python Django](https://github.com/pipelinit/pipelinit-sample-python/pulls)
- [Docker](https://github.com/pipelinit/pipelinit-sample-docker/pulls)
- [Vue](https://github.com/pipelinit/pipelinit-sample-vue-html/pulls)
- [Java with Gradle](https://github.com/pipelinit/pipelinit-sample-java-gradle/pulls)

## Supported stacks overview

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
      <th>GitHub Actions</th>
      <th>GitLab CI</th>
      <th>Travis CI</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td rowspan="2">CSS</td>
      <td>Format</td>
      <td>✔️</td>
      <td rowspan="13">Coming soon</td>
      <td rowspan="13">Coming soon</td>
    </tr>
    <tr>
      <td>Lint</td>
      <td>✔️</td>
    </tr>
    <tr>
      <td rowspan="2">HTML</td>
      <td>Format</td>
      <td>✔️</td>
    </tr>
    <tr>
      <td>Lint</td>
      <td>✔️</td>
    </tr>
    <tr>
      <td rowspan="3">JavaScript / Typescript</td>
      <td>Format</td>
      <td>✔️</td>
    </tr>
    <tr>
      <td>Lint</td>
      <td>✔️</td>
    </tr>
    <tr>
      <td>Test</td>
      <td>✔️</td>
    </tr>
    <tr>
      <td rowspan="3">Python</td>
      <td>Lint</td>
      <td>✔️</td>
    </tr>
    <tr>
      <td>Format</td>
      <td>✔️</td>
    </tr>
    <tr>
      <td>Test</td>
      <td>✔️</td>
    </tr>
    <tr>
      <td rowspan="2">Docker</td>
      <td>Lint</td>
      <td>✔️</td>
    </tr>
    <tr>
      <td>Build</td>
      <td>✔️</td>
    </tr>
    <tr>
      <td>Java</td>
      <td>Build (Gradle)</td>
      <td>✔️</td>
    </tr>
  </tbody>
</table>

To see details about which tools are used read the [Detailed stack support](docs/reference/stack-support.md), to learn more about the stages read [Stages](docs/explanation/stages.md).

## How it works

When you run Pipelinit in the root of a software project:

1. It checks what kind of files exists there to detect the _stacks_.
2. It collects more detailed data about each _stack_.
3. It uses that data to build the CI configuration files.

## Developing and contributing

We love contributions and our [Contributing Guide](CONTRIBUTING.md) is the best
place to start!

### Building and installing from source code

- [Building the @pipelinit/core package](core/README.md)
- [Building the CLI executable](cli/README.md)
