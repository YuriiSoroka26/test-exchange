import type { HyperliquidFill } from "@app/types/hyperliquid-fill";

/**
 * Infers whether a fill is a buy or sell based on available data
 */
export function inferIsBuy(f: HyperliquidFill): boolean {
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
