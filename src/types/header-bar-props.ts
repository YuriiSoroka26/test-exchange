import type { TabKey } from "./tab-key";

export interface HeaderBarProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  onAction: () => void;
  tickSize: number;
  onTickSizeChange: (tick: number) => void;
  symbol: string;
  symbols: string[];
  onSymbolChange: (s: string) => void;
}
