import { IntrospectFn } from "../../../types.ts";

export interface Black {
  name: "black";
  isDependency: boolean;
}

export const introspect: IntrospectFn<Black | null> = async (context) => {
  const isDependency = context.dependencies.includes("black");
  let hasBlackConfig = false;

  for await (const file of context.files.each("**/pyproject.toml")) {
    const pyproject = await context.files.readToml(file.path);
    hasBlackConfig = pyproject.tool?.black != null;
  }

  if (hasBlackConfig) {
    return {
      name: "black",
      isDependency: isDependency,
    };
  } else if (isDependency) {
    return {
      name: "black",
      isDependency: true,
    };
  }

  return null;
};
