import { useMemo } from "react";
import type { OrderBookProps } from "./order-book-props";
import {
  formatNumber,
  calculateDecimals,
  calculateOrderBookTotals,
} from "@app/utils";
import { ORDER_BOOK_HEADERS } from "@app/constants";
import styles from "./order-book.module.css";

export default function OrderBook({
  bids,
  asks,
  tickSize,
  symbol = "BTC",
  lastTrade,
}: OrderBookProps) {
  const decimals = useMemo(() => calculateDecimals(tickSize), [tickSize]);

  const { bidsWithTotals, asksWithTotals, maxTotal } = useMemo(
    () => calculateOrderBookTotals(bids, asks),
    [bids, asks]
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span>{ORDER_BOOK_HEADERS.price}</span>
        <span>
          {ORDER_BOOK_HEADERS.size} ({symbol})
        </span>
        <span>
          {ORDER_BOOK_HEADERS.total} ({symbol})
        </span>
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
      <div
        className={`${styles.mid} ${
          lastTrade?.side === "sell"
            ? styles.lastTradeSell
            : styles.lastTradeBuy
        }`}
      >
        {lastTrade ? formatNumber(lastTrade.price, decimals) : "—"}
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
