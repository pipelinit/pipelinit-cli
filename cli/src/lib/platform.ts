/**
 * Supported CI platforms
 */
export const platforms = [
  "github",
  "gitlab",
] as const;

export type Platform = (typeof platforms)[number];
export type Platforms = Array<Platform>;

/**
 * Type predicate to narrow down a regular string to a
 * type checked platform
 */
export function isPlatform(v: string): v is Platform {
  return platforms.some((platform) => platform === v);
}

/**
 * Type predicate to narrow down a regular string array to a
 * type checked array of platforms
 */
export function arePlatforms(v: string[]): v is Platforms {
  return v.every(isPlatform);
}
