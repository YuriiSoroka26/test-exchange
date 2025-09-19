import type { HyperliquidFill } from "./hyperliquid";

export type CompletedPerpTrade = {
  coin: string;
  direction: "long" | "short";
  openTime: number; // ms epoch
  closeTime: number; // ms epoch
  durationMs: number;
  realizedPnlUsd: number; // USD
};

/**
 * Reconstruct completed perp trades (position episodes) from fills.
 * A position episode starts when net position transitions from 0 -> non-zero,
 * and ends when it returns to 0. Direction is determined at episode start.
 */
export function reconstructCompletedPerpTrades(
  fills: HyperliquidFill[]
): CompletedPerpTrade[] {
  // Normalize and filter perp fills only
  const perpFills = fills.filter((f) => (f as any).perp !== false);

  // Ensure we have time ordering ascending
  perpFills.sort((a, b) => a.time - b.time);

  const completed: CompletedPerpTrade[] = [];

  const byCoin: Record<string, HyperliquidFill[]> = {};
  for (const f of perpFills) {
    const coin = f.coin;
    if (!byCoin[coin]) byCoin[coin] = [];
    byCoin[coin].push(f);
  }

  for (const [coin, coinFills] of Object.entries(byCoin)) {
    // Track a single episode per coin (can create multiple episodes over time)
    let netSize = 0; // >0 long, <0 short
    let avgEntryPx = 0; // weighted avg entry price for current episode
    let openTime = 0;
    let direction: "long" | "short" | null = null;
    let realizedPnl = 0;

    for (const f of coinFills) {
      let remaining = Math.abs(f.sz);
      const isBuy = inferIsBuy(f);
      const sideFactor = isBuy ? 1 : -1; // +1 buy, -1 sell
      const price = f.px;
      const t = f.time;

      // Helper to open position if currently flat
      const ensureOpen = () => {
        if (netSize === 0) {
          direction = sideFactor > 0 ? "long" : "short";
          openTime = t;
          avgEntryPx = price; // will be recomputed below as we add size
        }
      };

      // We may both close an existing episode and open a new one at the same timestamp if overshooting
      while (remaining > 1e-12) {
        if (netSize === 0 || Math.sign(netSize) === Math.sign(sideFactor)) {
          // Increasing exposure in current direction (or opening new)
          ensureOpen();
          const add = remaining;
          // Update weighted average entry price
          const currentSizeAbs = Math.abs(netSize);
          avgEntryPx =
            (avgEntryPx * currentSizeAbs + price * add) /
            (currentSizeAbs + add);
          netSize += sideFactor * add;
          remaining = 0;
        } else {
          // Opposite side: reduces exposure (partial or full close)
          const reducible = Math.min(Math.abs(netSize), remaining);
          // Compute PnL on the reduced portion
          if (direction === "long") {
            realizedPnl += (price - avgEntryPx) * reducible;
          } else if (direction === "short") {
            realizedPnl += (avgEntryPx - price) * reducible;
          }
          netSize += Math.sign(sideFactor) * reducible; // opposite sign reduces towards zero
          remaining -= reducible;
          if (Math.abs(netSize) <= 1e-12) {
            // Episode closed
            completed.push({
              coin,
              direction: direction || "long",
              openTime,
              closeTime: t,
              durationMs: Math.max(0, t - openTime),
              realizedPnlUsd: realizedPnl,
            });
            // Reset
            netSize = 0;
            avgEntryPx = 0;
            direction = null;
            realizedPnl = 0;
            // Loop continues; if remaining > 0, it will open a new episode at same timestamp
          }
        }
      }
    }
  }

  return completed;
}

function inferIsBuy(f: HyperliquidFill): boolean {
  if (typeof f.sz === "number" && f.sz !== 0) {
    // Commonly, positive sz indicates buy, negative indicates sell
    return f.sz > 0;
  }
  if (f.side === "B") return true;
  if (f.side === "S") return false;
  if (f.dir) {
    const d = f.dir.toLowerCase();
    if (
      d.includes("buy") ||
      d.includes("open long") ||
      d.includes("close short")
    )
      return true;
    if (
      d.includes("sell") ||
      d.includes("open short") ||
      d.includes("close long")
    )
      return false;
  }
  // Fallback: treat non-negative as buy
  return true;
}
