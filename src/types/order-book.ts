export interface Level {
  price: number;
  size: number;
}

export interface LastTrade {
  price: number;
  side: "buy" | "sell";
}

export interface OrderBookProps {
  bids: Array<Level>;
  asks: Array<Level>;
  tickSize: number;
  symbol?: string;
  lastTrade?: LastTrade;
}
