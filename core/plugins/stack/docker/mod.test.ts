import { context } from "../../../tests/mod.ts";
import { assertEquals, deepMerge } from "../../../deps.ts";
import { config, StackRegistry } from "../../../../cli/src/lib/config.ts";
import { Platforms } from "../../../../cli/src/lib/platform.ts";
import { FileEntry } from "../../../types.ts";

import { introspector } from "./mod.ts";

config.platforms = <Platforms> ["github"];

const fakeContext = () => {
  return deepMerge(
    context,
    {
      files: {
        // deno-lint-ignore require-await
        includes: async (glob: string): Promise<boolean> => {
          if (glob === "**/Dockerfile") {
            return true;
          }
          return false;
        },
        each: async function* (glob: string): AsyncIterableIterator<FileEntry> {
          if (glob === "**/Dockerfile") {
            yield {
              name: "Dockerfile",
              path: "fake-path",
            };
          }
          return;
        },
      },
    },
  );
};

Deno.test("Plugins > Check if Dockerfile is identified", async () => {
  const result = await introspector.introspect(
    fakeContext(),
  );

  assertEquals(result, {
    dockerContext: {
      paths: new Set(["fake-path"]),
    },
    hasDockerImage: true,
    registries: {
      urls: [
        "registry.hub.docker.com",
      ],
    },
  });
});

Deno.test("Plugins > Check if Dockerfile is identified and Other registry", async () => {
  config.registries = <StackRegistry> { docker: ["ghcr.io"] };

  const result = await introspector.introspect(
    fakeContext(),
  );

  assertEquals(result, {
    dockerContext: {
      paths: new Set(["fake-path"]),
    },
    hasDockerImage: true,
    registries: {
      urls: [
        "ghcr.io",
      ],
    },
  });
});
