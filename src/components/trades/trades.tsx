import type { TradesProps } from "./trades-props";
import { formatNumber } from "@app/utils";
import {
  TRADES_HEADERS,
  DEFAULT_PRICE_DECIMALS,
  DEFAULT_SIZE_DECIMALS,
  MAX_TRADES_DISPLAY,
} from "@app/constants";
import styles from "./trades.module.css";

export default function Trades({ trades, symbol = "BTC" }: TradesProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span>{TRADES_HEADERS.time}</span>
        <span>{TRADES_HEADERS.price}</span>
        <span>
          {TRADES_HEADERS.size} ({symbol})
        </span>
      </div>
      <div className={styles.body}>
        {trades.slice(0, MAX_TRADES_DISPLAY).map((t, i) => (
          <div key={i} className={styles.row}>
            <span className={styles.time}>
              {new Date(t.time).toLocaleTimeString()}
            </span>
            <span
              className={t.side === "buy" ? styles.priceBuy : styles.priceSell}
            >
              {formatNumber(t.price, DEFAULT_PRICE_DECIMALS)}
            </span>
            <span className={styles.size}>
              {formatNumber(t.size, DEFAULT_SIZE_DECIMALS)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
