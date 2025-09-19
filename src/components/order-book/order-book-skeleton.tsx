import styles from "./order-book.module.css";

export default function OrderBookSkeleton() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span>Price (USD)</span>
        <span>Size (BTC)</span>
        <span>Total (BTC)</span>
      </div>
      <div className={styles.asks}>
        {Array.from({ length: 11 }).map((_, i) => (
          <div key={`ask-${i}`} className={styles.rowAsk}>
            <div className={styles.backgroundBarAsk} style={{ width: "0%" }} />
            <span className={styles.priceAsk}>
              <div
                className={styles.skeletonText}
                style={{ width: "70px", marginLeft: "0" }}
              />
            </span>
            <span className={styles.size}>
              <div
                className={styles.skeletonText}
                style={{ width: "60px", marginLeft: "auto" }}
              />
            </span>
            <span className={styles.total}>
              <div
                className={styles.skeletonText}
                style={{ width: "60px", marginLeft: "auto" }}
              />
            </span>
          </div>
        ))}
      </div>
      <div className={styles.mid}>
        <div className={styles.skeletonText} style={{ width: "80px" }} />
      </div>
      <div className={styles.bids}>
        {Array.from({ length: 11 }).map((_, i) => (
          <div key={`bid-${i}`} className={styles.rowBid}>
            <div className={styles.backgroundBarBid} style={{ width: "0%" }} />
            <span className={styles.priceBid}>
              <div
                className={styles.skeletonText}
                style={{ width: "70px", marginLeft: "0" }}
              />
            </span>
            <span className={styles.size}>
              <div
                className={styles.skeletonText}
                style={{ width: "60px", marginLeft: "auto" }}
              />
            </span>
            <span className={styles.total}>
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
