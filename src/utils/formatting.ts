/**
 * Formats a number as USD currency
 */
export function formatUsd(n: number): string {
  const sign = n < 0 ? "-" : "";
  const v = Math.abs(n);
  const str =
    v >= 1000
      ? v.toLocaleString(undefined, { maximumFractionDigits: 2 })
      : v.toFixed(2);
  return `${sign}$${str}`;
}

/**
 * Formats a timestamp as a readable date string
 */
export function formatTime(ms: number): string {
  const d = new Date(ms);
  return d.toLocaleString();
}

/**
 * Formats a duration in milliseconds as a human-readable string
 */
export function formatDuration(ms: number): string {
  const sec = Math.floor(ms / 1000);
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}
