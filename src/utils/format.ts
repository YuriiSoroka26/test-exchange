/**
 * Formats a number with specified decimal places using locale-specific formatting
 */
export function formatNumber(n: number, decimals: number): string {
  return n.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Calculates the number of decimal places from a tick size
 */
export function calculateDecimals(tickSize: number): number {
  const s = tickSize.toString();
  const idx = s.indexOf(".");
  return idx === -1 ? 0 : s.length - idx - 1;
}
