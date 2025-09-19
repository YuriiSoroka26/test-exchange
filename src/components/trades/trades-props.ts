import type { TradeItem } from "@app/types/trade-item";

export interface TradesProps {
  trades: Array<TradeItem>;
  symbol?: string;
}
