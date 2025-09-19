import styles from "./trades.module.css";

export default function TradesSkeleton() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span>Time</span>
        <span>Price (USD)</span>
        <span>Size (BTC)</span>
      </div>
      <div className={styles.body}>
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i} className={styles.row}>
            <span className={styles.time}>
              <div
                className={styles.skeletonText}
                style={{ width: "70px", marginLeft: "0" }}
              />
            </span>
            <span className={styles.priceBuy}>
              <div
                className={styles.skeletonText}
                style={{ width: "80px", marginLeft: "auto" }}
              />
            </span>
            <span className={styles.size}>
              <div
                className={styles.skeletonText}
                style={{ width: "60px", marginLeft: "auto" }}
              />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
