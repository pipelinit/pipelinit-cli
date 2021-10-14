import { IntrospectFn } from "../../../types.ts";
import { config } from "../../../../cli/src/lib/config.ts";

export interface Registries {
  urls: string[];
}

export const introspect: IntrospectFn<Registries> = async () => {
  const configRegistry = await config.registries?.docker;
  if (configRegistry) {
    return <Registries> { urls: configRegistry };
  }
  return <Registries> { urls: ["registry.hub.docker.com"] };
};
