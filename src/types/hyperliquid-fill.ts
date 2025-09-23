export type HyperliquidFill = {
  time: number; // ms epoch
  coin: string;
  px: string | number; // price as string or number
  sz: string | number; // size in coin units
  side: "A" | "B"; // A = sell, B = buy
  startPosition: string | number; // position size after this fill
  dir: string;
  closedPnl: string | number;
  hash: string;
  oid: number; // order ID
  crossed: boolean; // whether order crossed the spread
  fee: string | number;
  tid: number; // trade ID
  feeToken: string;
  twapId?: number | null;
};
