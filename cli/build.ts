import { bundle } from "https://deno.land/x/buckets@0.1.0/mod.ts";
import * as esbuild from "https://deno.land/x/esbuild@v0.12.19/mod.js";

import conf from "./buckets.ts";
import { VERSION } from "./src/version.ts";

const TARGETS = [
  "x86_64-unknown-linux-gnu",
  "x86_64-pc-windows-msvc",
  "x86_64-apple-darwin",
  "aarch64-apple-darwin",
];

// Bundle and minify
await bundle(conf);
const beforeMinify = await Deno.readTextFile(conf.output);
const result = await esbuild.transform(beforeMinify, {
  minify: true,
});
await Deno.writeTextFile(conf.output, result.code);
esbuild.stop();

const compile = async function (target?: string) {
  const cmd = [
    "deno",
    "compile",
    "--unstable",
    "--allow-read=.",
    "--allow-write",
  ];
  if (target) {
    cmd.push(
      "--target",
      target,
      "--output",
      `bin/pipelinit-${VERSION}-${target}`,
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

const tar = async function (target: string) {
  const p = Deno.run({
    cwd: "bin",
    cmd: [
      "tar",
      "-czf",
      `pipelinit-${VERSION}-${target}.tar.gz`,
      `pipelinit-${VERSION}-${target}`,
    ],
  });

  const { code } = await p.status();
  if (code !== 0) {
    Deno.exit(code);
  }
};

const zip = async function (target: string) {
  const p = Deno.run({
    cwd: "bin",
    cmd: [
      "zip",
      "-9",
      `pipelinit-${VERSION}-${target}.zip`,
      `pipelinit-${VERSION}-${target}.exe`,
    ],
  });

  const { code } = await p.status();
  if (code !== 0) {
    Deno.exit(code);
  }
};

const compress = async function (target: string) {
  if (target === "x86_64-pc-windows-msvc") {
    await zip(target);
  } else {
    await tar(target);
  }
};

await compile();
for (const target of TARGETS) {
  await compile(target);
  await compress(target);
}
