export function anyValue(records: Record<string, unknown>): boolean {
  return Object.values(records).some((v) => v);
}
