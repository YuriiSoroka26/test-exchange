import type { HyperliquidFill, CompletedPerpTrade } from "@app/types";

export function reconstructCompletedPerpTrades(
  fills: HyperliquidFill[]
): CompletedPerpTrade[] {
  const sortedFills = [...fills].sort((a, b) => a.time - b.time);

  const completed: CompletedPerpTrade[] = [];

  const byCoin: Record<string, HyperliquidFill[]> = {};
  for (const fill of sortedFills) {
    const coin = fill.coin;
    if (!byCoin[coin]) byCoin[coin] = [];
    byCoin[coin].push(fill);
  }

  for (const [coin, coinFills] of Object.entries(byCoin)) {
    let currentTrade: {
      direction: "long" | "short";
      openTime: number;
      totalPnl: number;
      totalFees: number;
      isActive: boolean;
    } | null = null;

    for (let i = 0; i < coinFills.length; i++) {
      const fill = coinFills[i];
      const dir = fill.dir || "";
      const closedPnl = parseFloat(String(fill.closedPnl || "0"));
      const fee = parseFloat(String(fill.fee || "0"));
      const startPosition = parseFloat(String(fill.startPosition || "0"));

      const sz = parseFloat(String(fill.sz || "0"));
      const side = fill.side; // 'B' for buy, 'A' for sell/ask
      const positionChange = side === "B" ? sz : -sz;
      const endPosition = startPosition + positionChange;

      const isOpenFill = dir.includes("Open");

      if (isOpenFill) {
        if (currentTrade && currentTrade.isActive) {
          console.warn(
            `Incomplete trade detected for ${coin} - starting new position without closing previous one`
          );
        }

        const direction = dir.includes("Long") ? "long" : "short";
        currentTrade = {
          direction,
          openTime: fill.time,
          totalPnl: closedPnl,
          totalFees: fee,
          isActive: true,
        };
      } else if (currentTrade && currentTrade.isActive) {
        currentTrade.totalPnl += closedPnl;
        currentTrade.totalFees += fee;

        if (Math.abs(endPosition) < 1e-6) {
          if (Math.abs(currentTrade.totalPnl) > 0.01) {
            completed.push({
              coin,
              direction: currentTrade.direction,
              openTime: currentTrade.openTime,
              closeTime: fill.time,
              durationMs: fill.time - currentTrade.openTime,
              realizedPnlUsd: currentTrade.totalPnl,
            });
          }
          currentTrade.isActive = false;
        }
      }
    }
  }

  return completed.sort((a, b) => a.openTime - b.openTime);
}
