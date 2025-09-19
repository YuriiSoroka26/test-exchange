import type { TabKey } from "./tab-key";

export interface TabMenuProps {
  activeTab: TabKey;
  onChange: (tab: TabKey) => void;
  onActionClick?: () => void;
  actionLabel?: string;
}
