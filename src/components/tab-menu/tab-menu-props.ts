import type { TabKey } from "@app/types/tab-key";

export interface TabMenuProps {
  activeTab: TabKey;
  onChange: (tab: TabKey) => void;
  onActionClick?: () => void;
  actionLabel?: string;
}
