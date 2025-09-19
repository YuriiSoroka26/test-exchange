import type { TradesProps } from "../../types/trades";
import styles from "./trades.module.css";

export default function Trades({ trades, symbol = "BTC" }: TradesProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span>Time</span>
        <span>Price (USD)</span>
        <span>Size ({symbol})</span>
      </div>
      <div className={styles.body}>
        {trades.map((t, i) => (
          <div key={i} className={styles.row}>
            <span className={styles.time}>
              {new Date(t.time).toLocaleTimeString()}
            </span>
            <span
              className={t.side === "buy" ? styles.priceBuy : styles.priceSell}
            >
              {t.price.toLocaleString()}
            </span>
            <span className={styles.size}>
              {t.size.toLocaleString(undefined, { maximumFractionDigits: 4 })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
