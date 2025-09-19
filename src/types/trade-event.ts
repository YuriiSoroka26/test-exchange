export interface TradeEvent {
  time: number;
  price: number;
  size: number;
  side: "buy" | "sell";
}
