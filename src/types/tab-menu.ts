export type TabKey = "orderbook" | "trades";

export interface TabMenuProps {
  activeTab: TabKey;
  onChange: (tab: TabKey) => void;
  onActionClick?: () => void;
  actionLabel?: string;
}
