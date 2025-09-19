import type { Option } from "@app/types/option";

export interface DropdownProps<T extends string | number> {
  label?: string;
  options: Array<Option<T>>;
  value: T;
  onChange: (value: T) => void;
}
