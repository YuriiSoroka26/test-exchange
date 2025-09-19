export type MarketSymbol = string; // e.g., "BTC" or "ETH"

export interface OrderBookSnapshot {
  bids: Array<[number, number]>; // [price, size]
  asks: Array<[number, number]>; // [price, size]
}

export interface TradeEvent {
  time: number;
  price: number;
  size: number;
  side: "buy" | "sell";
}

type Listener<T> = (data: T) => void;

type L2LevelRaw = { px: string; sz: string; n?: number };
type L2BookData = {
  coin: string;
  time: number;
  levels: [L2LevelRaw[], L2LevelRaw[]];
};
type L2BookMessage = { channel: "l2Book"; data: L2BookData };

type TradeRaw = {
  time?: number;
  px: string;
  sz: string;
  side: "B" | "A" | "buy" | "sell";
};
type TradesMessage = { channel: "trades"; data: TradeRaw[] };

export {
  Listener,
  L2LevelRaw,
  L2BookData,
  L2BookMessage,
  TradeRaw,
  TradesMessage,
};
