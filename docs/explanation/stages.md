# Stages

Which stages are present in the final CI pipeline depends on the identified
stacks and their support. You can check a complete reference of supported tools,
stacks, and which stages are available to each one further down in this
document.

Here is a list of available stages and what is the goal of each one:

## Format

The format step checks if the code follows the format style from an automated
code formatter.

Formatters are valuable for most programming languages and text files because:

- It makes the code style looks the same regardless of the project
- It removes style discussions from code review
- It free developers from thinking about code style

## Lint

The lint step uses static analysis tools to improve overall code quality. It
enforces some rules in the code base and can detect bugs before execution.

Linters are valuable for most programming languages and text files because:

- It helps to build more standardized codebases, which is easier to read and
  maintain
- It can prevent some bugs
- It helps to delete unused code
- It is a great tool to teach how to write better code

## SAST

The SAST (Static application security testing) step uses static analysis tools
to improve overall code security. This step is distinct from the _Lint_ step
because of the security focus.

One issue with SAST tools is that they generate false positives. That's why the
default behavior for this step is to allow failure.

SAST tools are valuable for most applications and libraries because:

- It prevents vulnerabilities early
- It improves application reliability
- It is a great tool to teach how to write safer code

## Test

The test step runs automated tests detected in the project.

The scope of this step isn't individual files but the application or library.
This stage may start extra services if the application or library requires it.

Any application or library, no matter how small the codebase or the team,
benefits from automated tests because:

- It prevents bugs from (re)appearing
- It helps to onboard new contributors
- It's required to refactor the codebase towards something better
- It documents how the software behaves

The benefits far outweigh the costs.
