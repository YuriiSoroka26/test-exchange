import type { TradesProps } from "../../types/trades";
import styles from "./trades.module.css";

function formatNumber(n: number, decimals: number) {
  return n.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export default function Trades({ trades, symbol = "BTC" }: TradesProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span>Time</span>
        <span>Price (USD)</span>
        <span>Size ({symbol})</span>
      </div>
      <div className={styles.body}>
        {trades.slice(0, 24).map((t, i) => (
          <div key={i} className={styles.row}>
            <span className={styles.time}>
              {new Date(t.time).toLocaleTimeString()}
            </span>
            <span
              className={t.side === "buy" ? styles.priceBuy : styles.priceSell}
            >
              {formatNumber(t.price, 2)}
            </span>
            <span className={styles.size}>{formatNumber(t.size, 3)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
