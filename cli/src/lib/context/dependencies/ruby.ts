import { Context } from "../../../../deps.ts";

const rubyDepRegex = /(?:(["'])(?<DependencyName>[a-zA-Z\-_\.]+)["'])/gm;

function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined;
}

export const rubyDependency = async (context: Context) => {
  for await (const file of await context.files.each("**/Gemfile")) {
    const rubyDepsText = await context.files.readText(file.path);

    const depsRuby: string[] = Array.from(
      rubyDepsText.matchAll(rubyDepRegex),
      (match) => !match.groups ? null : match.groups.DependencyName,
    ).filter(notEmpty);

    if (depsRuby) {
      return depsRuby;
    }
  }
  return [];
};
