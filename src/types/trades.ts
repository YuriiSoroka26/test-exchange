export interface TradeItem {
  time: number; // unix ms
  price: number;
  size: number;
  side: "buy" | "sell";
}

export interface TradesProps {
  trades: Array<TradeItem>;
  symbol?: string;
}
