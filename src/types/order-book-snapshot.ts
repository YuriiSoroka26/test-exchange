export interface OrderBookSnapshot {
  bids: Array<[number, number]>; // [price, size]
  asks: Array<[number, number]>; // [price, size]
}
