export type CompletedPerpTrade = {
  coin: string;
  direction: "long" | "short";
  openTime: number; // ms epoch
  closeTime: number; // ms epoch
  durationMs: number;
  realizedPnlUsd: number; // USD
};
