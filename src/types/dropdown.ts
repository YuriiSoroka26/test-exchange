export interface Option<T extends string | number> {
  label: string;
  value: T;
}

export interface DropdownProps<T extends string | number> {
  label?: string;
  options: Array<Option<T>>;
  value: T;
  onChange: (value: T) => void;
}
