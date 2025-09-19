import type { Level } from "./level";
import type { LastTrade } from "./last-trade";

export interface OrderBookProps {
  bids: Array<Level>;
  asks: Array<Level>;
  tickSize: number;
  symbol?: string;
  lastTrade?: LastTrade;
}
