import type { DropdownProps } from "./dropdown-props";
import styles from "./dropdown.module.css";

export default function Dropdown<T extends string | number>({
  options,
  value,
  onChange,
}: DropdownProps<T>) {
  return (
    <div className={styles.container}>
      <select
        className={styles.select}
        value={String(value)}
        onChange={e => onChange(e.target.value as unknown as T)}
      >
        {options.map(opt => (
          <option key={String(opt.value)} value={String(opt.value)}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
