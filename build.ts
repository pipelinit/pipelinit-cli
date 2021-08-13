import { bundle } from "https://deno.land/x/buckets@0.1.0/mod.ts";
import * as esbuild from "https://deno.land/x/esbuild@v0.12.19/mod.js";

import conf from "./buckets.ts";

// Bundle and minify
await bundle(conf);
const beforeMinify = await Deno.readTextFile(conf.output);
const result = await esbuild.transform(beforeMinify, {
  minify: true,
});
await Deno.writeTextFile(conf.output, result.code);
esbuild.stop();

// Compile the bundle
const p = Deno.run({
  cmd: [
    "deno",
    "compile",
    "--unstable",
    "--allow-read=.",
    "--allow-write",
    "--output",
    "bin/pipelinit",
    conf.output,
  ],
});

const { code } = await p.status();
Deno.exit(code);
