import { Context, introspectors } from "../../../deps.ts";
import {
  jsDenoDependency,
  jsNodeDependency,
  pythonDependency,
  rubyDependency,
} from "./dependencies/mod.ts";

type StacksList = ((typeof introspectors)[number]["name"])[];

export async function listDependencies(
  stackList: StacksList,
  context: Context,
): Promise<string[]> {
  for (const stack of stackList) {
    switch (stack) {
      case "javascript":
        return await jsNodeDependency(context) ||
          await jsDenoDependency(context);
      case "python":
        return await pythonDependency(context);
      case "ruby":
        return await rubyDependency(context);
    }
  }
  return [];
}
