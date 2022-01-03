import { IntrospectFn } from "../../../types.ts";

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
  if (await context.dependencies.some((dep) => webApps.has(dep))) {
    return "webApp";
  }
  return null;
};
