import { IntrospectFn } from "../../../types.ts";

export interface DockerContext {
  paths: Set<string>;
}

export const introspect: IntrospectFn<DockerContext> = async (context) => {
  const dockerContextPaths = new Set();
  for await (const file of context.files.each("**/Dockerfile")) {
    const contextPath = file.path.replace(
      await context.filesWorkDir() + "/",
      "",
    ).replace("/" + file.name, "").replace(file.name, "");
    dockerContextPaths.add(contextPath);
  }
  return <DockerContext> { paths: dockerContextPaths };
};
