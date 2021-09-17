import { bundle } from "https://deno.land/x/buckets@0.1.0/mod.ts";
import * as esbuild from "https://deno.land/x/esbuild@v0.12.19/mod.js";

import conf from "./buckets.ts";

const TARGETS = [
  "x86_64-unknown-linux-gnu",
  "x86_64-pc-windows-msvc",
  "x86_64-apple-darwin",
  "aarch64-apple-darwin",
];

const target: string | undefined = Deno.env.get("BUILD_TARGET");
const version: string | undefined = Deno.env.get("RELEASE_VERSION");

if (target && !TARGETS.includes(target)) {
  console.error(
    `Invalid build target '${target}'. Must be one of:`,
  );
  console.error(TARGETS.join("\n"));
  Deno.exit(1);
}

if (target && !version) {
  console.error(
    "The environment variable RELEASE_VERSION must be defined if BUILD_TARGET is also defined",
  );
  Deno.exit(1);
}

// Bundle and minify
await bundle(conf);
const beforeMinify = await Deno.readTextFile(conf.output);
const result = await esbuild.transform(beforeMinify, {
  minify: true,
});
await Deno.writeTextFile(conf.output, result.code);
esbuild.stop();

const compile = async function (target?: string, version?: string) {
  const cmd = [
    "deno",
    "compile",
    "--unstable",
    "--allow-read=.",
    "--allow-write",
  ];
  if (target && version) {
    cmd.push(
      "--target",
      target,
      "--output",
      `bin/pipelinit-${version}-${target}`,
    );
  } else {
    cmd.push("--output", "bin/pipelinit");
  }
  cmd.push(conf.output);
  const p = Deno.run({ cmd });

  const { code } = await p.status();
  if (code !== 0) {
    Deno.exit(code);
  }
};

const tar = async function (target: string, version: string) {
  const p = Deno.run({
    cwd: "bin",
    cmd: [
      "tar",
      "-czf",
      `pipelinit-${version}-${target}.tar.gz`,
      `pipelinit-${version}-${target}`,
    ],
  });

  const { code } = await p.status();
  if (code !== 0) {
    Deno.exit(code);
  }
};

const zip = async function (target: string, version: string) {
  const p = Deno.run({
    cwd: "bin",
    cmd: [
      "zip",
      "-9",
      `pipelinit-${version}-${target}.zip`,
      `pipelinit-${version}-${target}.exe`,
    ],
  });

  const { code } = await p.status();
  if (code !== 0) {
    Deno.exit(code);
  }
};

const compress = async function (target: string, version: string) {
  if (target === "x86_64-pc-windows-msvc") {
    await zip(target, version);
  } else {
    await tar(target, version);
  }
};

await compile(target, version);

if (target && version) {
  await compress(target, version);
}

await Deno.remove(conf.output);
