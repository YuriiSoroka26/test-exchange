import type { TabMenuProps } from "../../types";
import { TAB_LABELS } from "../../constants";
import { HiDotsVertical } from "react-icons/hi";
import styles from "./tab-menu.module.css";

export default function TabMenu({
  activeTab,
  onChange,
  onActionClick,
}: // actionLabel = "Action", // Currently unused but kept for future use
TabMenuProps) {
  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        <button
          className={`${
            activeTab === "orderbook" ? styles.tabActive : styles.tab
          } ${styles.orderBookTab}`}
          onClick={() => onChange("orderbook")}
        >
          {TAB_LABELS.orderbook}
        </button>
        <button
          className={activeTab === "trades" ? styles.tabActive : styles.tab}
          onClick={() => onChange("trades")}
        >
          {TAB_LABELS.trades}
        </button>
      </div>
      <button className={styles.action} onClick={onActionClick}>
        <HiDotsVertical size={12} />
      </button>
    </div>
  );
}
