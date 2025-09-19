import type { TabMenuProps } from "../../types/tab-menu";
import { HiDotsVertical } from "react-icons/hi";
import styles from "./tab-menu.module.css";

export default function TabMenu({
  activeTab,
  onChange,
  onActionClick,
  actionLabel = "Action",
}: TabMenuProps) {
  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        <button
          className={`${
            activeTab === "orderbook" ? styles.tabActive : styles.tab
          } ${styles.orderBookTab}`}
          onClick={() => onChange("orderbook")}
        >
          Order Book
        </button>
        <button
          className={activeTab === "trades" ? styles.tabActive : styles.tab}
          onClick={() => onChange("trades")}
        >
          Trades
        </button>
      </div>
      <button className={styles.action} onClick={onActionClick}>
        <HiDotsVertical size={12} />
      </button>
    </div>
  );
}
