export type HyperliquidFill = {
  time: number; // ms epoch
  coin: string; // e.g., "ETH", "BTC"
  px: number; // price
  sz: number; // size in coin units (positive for buy, negative for sell?)
  dir?: string; // direction label if provided by API
  side?: "B" | "S"; // sometimes side is present
  perp?: boolean; // true for perp trades
  closedPnl?: number; // realized PnL in USD on this fill (if available)
  fee?: number; // fee in USD
};
