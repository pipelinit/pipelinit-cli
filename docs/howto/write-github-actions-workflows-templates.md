# How to write GitHub Actions Workflows templates

The template files at `core/templates/github` define how the final CI files are
generated for projects analyzed by Pipelinit. To make sure Pipelinit generates
CI pipelines with good quality, there are some guidelines to keep in mind while
writing the template files.

## Priorities

1. Compatibility between tools used in the dev environment and the CI pipeline
2. Fast pipelines

## Keep it shallow

Write shallow workflows files, with jobs that finish fast and doesn't have too
many dependencies.

## Keep it wide

Write multiple workflow files, each focused in dealing with one particular
stack. Use conditional controls to skip everything possible, just run a job if
it's relevant to the PR.

## Choosing the proper step

GitHub self-managed runners come with a nice collection of pre-installed tools.
The Actions available in the marketplace comes in two main variants: Actions
that don't use Docker and Actions that do.

Actions that use Docker should be avoided, because the build time of the Action
is moved towards the end-project CI Pipeline. Prefer Actions build with
JavaScript or TypeScript.

Because some projects come with dependencies declaration, relevants to the
project stack, to maintain compatibility the CI should prefer tools declared
in those dependencies (ex: npm package, ruby gem, etc).

With those things in mind, here is a list starting with the most preferred to
the least preferred way to use a tool in a job step:

1. Executable installed with project dependencies (use cache!)
2. Official Action that doesn't use Docker
3. Executable [pre-installed in the runner](https://github.com/actions/virtual-environments/blob/main/images/linux/Ubuntu2004-README.md)
4. Executable installable with a package manager
5. Executable downloadable from official channels (ex: tar.gz from releases)
6. Official Docker image
7. Official Action that uses Docker
8. Community Action
9. Community Docker image
