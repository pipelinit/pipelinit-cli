import { DETECTORS } from "./detectors/mod.ts";

export const detectPlatforms = async (): Promise<Array<string>> => {
  const detectResults = await Promise.all(DETECTORS.map((d) => d.detect()));
  return DETECTORS
    .filter((_, i) => detectResults[i])
    .map((d) => d.platform);
};
