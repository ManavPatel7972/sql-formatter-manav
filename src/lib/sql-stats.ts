export function getStats(sql: string) {
  const chars = sql.length;
  const words = sql.trim() ? sql.trim().split(/\s+/).length : 0;
  const lines = sql ? sql.split(/\n/).length : 0;
  const queries = sql
    .split(";")
    .map((q) => q.trim())
    .filter(Boolean).length;
  return { chars, words, lines, queries };
}
