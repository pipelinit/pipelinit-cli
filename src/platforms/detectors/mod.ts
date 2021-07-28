import { GitHubDetector } from "./github.ts";
import { PlatformDetector } from "./detector.ts";

export const DETECTORS: Array<PlatformDetector> = [new GitHubDetector()];
