export interface TradeItem {
  time: number; // unix ms
  price: number;
  size: number;
  side: "buy" | "sell";
}
