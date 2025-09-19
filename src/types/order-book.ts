export interface Level {
  price: number;
  size: number;
}

export interface OrderBookProps {
  bids: Array<Level>;
  asks: Array<Level>;
  tickSize: number;
}
