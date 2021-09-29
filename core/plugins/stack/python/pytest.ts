import { IntrospectFn } from "../../../types.ts";

export const introspect: IntrospectFn<boolean> = async (context) => {
  const hasPyTest = await context.files.includes("**/pytest.ini");
  if (hasPyTest) {
    return true;
  }

  for await (const file of context.files.each("**/pyproject.toml")) {
    const pyProject = await context.files.readToml(file.path);
    const hasPytest = pyProject.tool.pytest;
    if (hasPytest) {
      return true;
    }
  }

  return false;
};
