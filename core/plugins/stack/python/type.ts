import { IntrospectFn } from "../../../types.ts";
import { hasPythonDependencyAny } from "./dependencies.ts";

const webApps = new Set([
  "uvicorn",
  "fastapi",
  "starlette",
  "aiohttp",
  "bottle",
  "cherrypy",
  "django",
  "cubicweb",
  "dash",
  "falcon",
  "flask",
  "growler",
  "giotto",
  "hug",
  "morepath",
  "pycnic",
  "uwsgi",
  "Pylons",
  "pyramid",
  "waitress",
  "sanic",
  "tornado",
  "TurboGears2",
  "web2py",
]);

export const introspect: IntrospectFn<string | null> = async (context) => {
  if (await hasPythonDependencyAny(context, webApps)) {
    return "webApp";
  }
  return null;
};
