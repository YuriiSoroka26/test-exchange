import type { Level } from "../types/level";

export interface LevelWithTotal extends Level {
  total: number;
}

export interface OrderBookTotals {
  bidsWithTotals: LevelWithTotal[];
  asksWithTotals: LevelWithTotal[];
  maxTotal: number;
}

/**
 * Calculates cumulative totals for order book levels
 */
export function calculateOrderBookTotals(
  bids: Level[],
  asks: Level[]
): OrderBookTotals {
  let cumulativeBid = 0;
  const bidsWithTotals = bids.map((bid) => {
    cumulativeBid += bid.size;
    return { ...bid, total: cumulativeBid };
  });

  let cumulativeAsk = 0;
  const asksWithTotals = asks.map((ask) => {
    cumulativeAsk += ask.size;
    return { ...ask, total: cumulativeAsk };
  });

  const maxTotal = Math.max(
    bidsWithTotals[bidsWithTotals.length - 1]?.total || 0,
    asksWithTotals[asksWithTotals.length - 1]?.total || 0
  );

  return { bidsWithTotals, asksWithTotals, maxTotal };
}
