import TabMenu from "../tab-menu";
import Dropdown from "../dropdown";
import type { HeaderBarProps } from "./header-bar-props";
import {
  TICK_SIZE_OPTIONS,
  ACTION_LABELS,
  DROPDOWN_LABELS,
} from "@app/constants";
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
  const tickOptions = TICK_SIZE_OPTIONS.map(v => ({
    label: v.toString(),
    value: v,
  }));
  const symbolOptions = symbols.map(s => ({ label: s, value: s }));

  return (
    <div className={styles.container}>
      <TabMenu
        activeTab={activeTab}
        onChange={onTabChange}
        onActionClick={onAction}
        actionLabel={ACTION_LABELS.action}
      />
      <div className={styles.controls}>
        <Dropdown<number>
          label={DROPDOWN_LABELS.group}
          options={tickOptions}
          value={tickSize}
          onChange={onTickSizeChange}
        />
        <Dropdown<string>
          label={DROPDOWN_LABELS.coin}
          options={symbolOptions}
          value={symbol}
          onChange={onSymbolChange}
        />
      </div>
    </div>
  );
}
