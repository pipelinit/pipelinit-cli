# Pipelinit

Bootstrap and manage CI pipelines.

## How to use

Run pipelinit in your project root.

If the project isn't initialized, it asks what CI platform you use.

After the asnwer (or if the project is initialized) it:

1. Detects what programming languages and tools it uses (stacks)
2. Creates CI pipelines configuration files for your project

Now you just need to check the created (or updated) files into git.

## Supported Stacks

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
      <th>GitHub</th>
      <th>GitLab</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td rowspan="2">CSS</td>
      <td>Format</td>
      <td>✔️</td>
      <td rowspan="8">Coming soon</td>
    </tr>
    <tr>
      <td>Lint</td>
      <td>✔️</td>
    </tr>
    <tr>
      <td rowspan="2">JavaScript (Node.js)</td>
      <td>Format</td>
      <td>✔️</td>
    </tr>
    <tr>
      <td>Lint</td>
      <td>✔️</td>
    </tr>
    <tr>
      <td rowspan="3">JavaScript (Deno)</td>
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
      <td>Python</td>
      <td>Lint</td>
      <td>✔️</td>
    </tr>
  </tbody>
</table>

## Building

Pipelinit is built with Deno. To build the project from source, make sure you
have Deno installed. You can check how to install it
[in the official Deno website](https://deno.land/#installation)

Run the following command:

```
deno run --unstable --allow-read --allow-write --allow-net --allow-env --allow-run build.ts
```

It creates the executable at `bin/pipelinit`.
