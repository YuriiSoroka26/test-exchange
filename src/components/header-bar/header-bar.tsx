import TabMenu from "../tab-menu";
import Dropdown from "../dropdown";
import type { HeaderBarProps } from "../../types/header-bar";
import styles from "./header-bar.module.css";

export default function HeaderBar({
  activeTab,
  onTabChange,
  onAction,
  tickSize,
  onTickSizeChange,
  symbol,
  symbols,
  onSymbolChange,
}: HeaderBarProps) {
  const tickOptions = [0.001, 0.01, 0.1, 1].map((v) => ({
    label: v.toString(),
    value: v,
  }));
  const symbolOptions = symbols.map((s) => ({ label: s, value: s }));

  return (
    <div className={styles.container}>
      <TabMenu
        activeTab={activeTab}
        onChange={onTabChange}
        onActionClick={onAction}
        actionLabel="Action"
      />
      <div className={styles.controls}>
        <Dropdown<number>
          label="Group"
          options={tickOptions}
          value={tickSize}
          onChange={onTickSizeChange}
        />
        <Dropdown<string>
          label="Coin"
          options={symbolOptions}
          value={symbol}
          onChange={onSymbolChange}
        />
      </div>
    </div>
  );
}
