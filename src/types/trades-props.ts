import type { TradeItem } from "./trade-item";

export interface TradesProps {
  trades: Array<TradeItem>;
  symbol?: string;
}
