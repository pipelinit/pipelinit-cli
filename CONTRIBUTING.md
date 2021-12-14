# Contributing to Pipelinit

Thanks for your interest in contributing to Pipelinit. If this is your first
contribution, please read our [code of conduct](CODE_OF_CONDUCT.md) and the
Pipelinit core concepts.

There are several ways you can contribute to the project:
- Fixing or updating documentation
- Adding new stack plugins
- Improving existing stack plugins
- Writing new template plugins
- Improving existing template plugins
## Requirements

Pipelinit is built with Deno check how to install it
[on the official Deno website](https://deno.land/#installation).
To install the executable locally, use the command:

```deno install -f --unstable --allow-read=.,$(pwd) --allow-write=. cli/pipelinit.ts```

This automatically updates the executable as you change the source code,
eliminating the need to rebuild and reinstall the CLI.

Note:

Every permission on Deno is opt-in, that is: a running program has no file,
network, or environment access, making it secure by default.

For this build, we need only the current directory read and write permissions,
thus we add to the command the flags `--allow-read` and `allow-write` and pass
the `.` and `$(pwd)`.

To learn more about Deno security and permissions refer to the
[docs](https://deno.land/manual/getting_started/permissions).

## Testing

To run the project automated tests use:
```
deno test --unstable --allow-all --coverage=cov_profile
```

And to check the test coverage use:
```
deno coverage cov_profile
```

It's possible too to generate an HTML index for better readability:
```
deno coverage --lcov cov_profile > cov.lcov
genhtml -o html_cov cov.lcov
firefox html_cov/index.html
```

|⚠️|Clear the content from cov_profile between each test run. Otherwise your coverage data may be incorrect.|
|--|---|

## Coding

Before you open a PR, please make sure your code follows the [Code Style Guide](docs/reference/code-style-guide.md).

If you want to write or improve stack plugin, the following resources can help:
- [How to write a stack plugin](docs/howto/write-a-new-plugin.md)
- [Tutorial: Creating a plugin for Markdown](docs/tutorials/creating-a-plugin-for-markdown.md)
