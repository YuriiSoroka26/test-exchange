import { useMemo } from "react";
import type { OrderBookProps } from "../../types/order-book";
import styles from "./order-book.module.css";

function formatNumber(n: number, decimals: number) {
  return n.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export default function OrderBook({ bids, asks, tickSize }: OrderBookProps) {
  console.log("OrderBook props:", { bids, asks, tickSize });

  const decimals = useMemo(() => {
    const s = tickSize.toString();
    const idx = s.indexOf(".");
    return idx === -1 ? 0 : s.length - idx - 1;
  }, [tickSize]);

  const maxBid = bids.length ? bids[0].price : 0;
  const minAsk = asks.length ? asks[0].price : 0;
  const mid = maxBid && minAsk ? (maxBid + minAsk) / 2 : 0;

  // Calculate cumulative totals for background bars
  const { bidsWithTotals, asksWithTotals, maxTotal } = useMemo(() => {
    let cumulativeBid = 0;
    const bidsWithTotals = bids.map((bid) => {
      cumulativeBid += bid.size;
      return { ...bid, total: cumulativeBid };
    });

    let cumulativeAsk = 0;
    const asksWithTotals = asks.map((ask) => {
      cumulativeAsk += ask.size;
      return { ...ask, total: cumulativeAsk };
    });

    const maxTotal = Math.max(
      bidsWithTotals[bidsWithTotals.length - 1]?.total || 0,
      asksWithTotals[asksWithTotals.length - 1]?.total || 0
    );

    return { bidsWithTotals, asksWithTotals, maxTotal };
  }, [bids, asks]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span>Price</span>
        <span>Size</span>
        <span>Total</span>
      </div>
      <div className={styles.asks}>
        {asksWithTotals.map((l, i) => {
          const barWidth = maxTotal > 0 ? (l.total / maxTotal) * 100 : 0;
          return (
            <div key={`a-${i}`} className={styles.rowAsk}>
              <div
                className={styles.backgroundBarAsk}
                style={{ width: `${barWidth}%` }}
              />
              <span className={styles.priceAsk}>
                {formatNumber(l.price, decimals)}
              </span>
              <span className={styles.size}>{formatNumber(l.size, 3)}</span>
              <span className={styles.total}>{formatNumber(l.total, 3)}</span>
            </div>
          );
        })}
      </div>
      <div className={styles.mid}>
        Mid: {mid ? formatNumber(mid, decimals) : "—"}
      </div>
      <div className={styles.bids}>
        {bidsWithTotals.map((l, i) => {
          const barWidth = maxTotal > 0 ? (l.total / maxTotal) * 100 : 0;
          return (
            <div key={`b-${i}`} className={styles.rowBid}>
              <div
                className={styles.backgroundBarBid}
                style={{ width: `${barWidth}%` }}
              />
              <span className={styles.priceBid}>
                {formatNumber(l.price, decimals)}
              </span>
              <span className={styles.size}>{formatNumber(l.size, 3)}</span>
              <span className={styles.total}>{formatNumber(l.total, 3)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
