import { IntrospectFn } from "../../../types.ts";

export interface ISort {
  name: "isort";
  isDependency: boolean;
}

export const introspect: IntrospectFn<ISort | null> = async (context) => {
  const isDependency = await context.dependencies.includes("isort");
  let hasISortConfig = false;

  for await (const file of context.files.each("**/pyproject.toml")) {
    const pyproject = await context.files.readToml(file.path);
    hasISortConfig = pyproject.tool?.isort != null;
  }

  if (!hasISortConfig) {
    hasISortConfig = await context.files.includes(
      "**/isort.cfg",
    );
  }

  if (hasISortConfig) {
    return {
      name: "isort",
      isDependency: isDependency,
    };
  } else if (isDependency) {
    return {
      name: "isort",
      isDependency: true,
    };
  }

  return null;
};
