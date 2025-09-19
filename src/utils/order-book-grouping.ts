import type { Level } from "../types";

/**
 * Groups order book levels by tick size (similar to Binance-style grouping)
 */
export function groupLevels(
  levels: Level[],
  tickSize: number,
  direction: "up" | "down"
): Level[] {
  if (levels.length === 0) return [];

  const buckets = new Map<number, number>();

  for (const { price, size } of levels) {
    // Binance-style grouping: round to the nearest tick
    const grouped = Math.round(price / tickSize) * tickSize;
    const key = Number(grouped.toFixed(10));
    buckets.set(key, (buckets.get(key) || 0) + size);
  }

  const res = Array.from(buckets.entries()).map(([price, total]) => ({
    price,
    size: total,
  }));

  // Sort based on direction
  res.sort((a, b) =>
    direction === "up" ? a.price - b.price : b.price - a.price
  );

  // Return top 11 levels for display
  return res.slice(0, 11);
}
