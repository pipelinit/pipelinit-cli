export interface PlatformDetector {
  platform: string;
  detect: () => Promise<boolean>;
}
