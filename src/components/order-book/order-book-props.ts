import type { Level } from "@app/types/level";
import type { LastTrade } from "@app/types/last-trade";

export interface OrderBookProps {
  bids: Array<Level>;
  asks: Array<Level>;
  tickSize: number;
  symbol?: string;
  lastTrade?: LastTrade;
}
