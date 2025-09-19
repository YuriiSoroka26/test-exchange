import type { TradeRaw } from "./trade-raw";

export type TradesMessage = { channel: "trades"; data: TradeRaw[] };
