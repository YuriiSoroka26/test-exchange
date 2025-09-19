export type TradeRaw = {
  time?: number;
  px: string;
  sz: string;
  side: "B" | "A" | "buy" | "sell";
};
