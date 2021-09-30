# Concepts

Pipelinit generates pipeline configuration based on these core concepts:

- Stacks
- CI Stage
- CI Platform

## Stacks

A _Stack_ is a set of technologies used by a project, such as programming
languages, frameworks, libraries, and tools. Pipelinit introspects a project
searching for technologies that a CI pipeline can check.

## CI Stage

A _Stage_ is a step in a CI pipeline that performs tasks with **similar goals**
independent from the _stack_. Each step can have multiple substeps. Pipelinit
generates standardized CI pipelines with well-defined _stages_. The tools that
each step uses change to fit the stack but serve the same purpose.

Every stage uses Free or Open Source software.

## CI Platform

A _CI Platform_ is a public SaaS or self-hosted solution that runs the CI
pipeline. Every platform has its capabilities, features, and configurations.
Pipelinit leverages the platform features and generates configuration files to
build a pipeline tuned for the chosen platform.
