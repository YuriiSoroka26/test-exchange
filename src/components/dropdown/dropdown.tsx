import type { DropdownProps } from "../../types/dropdown";
import styles from "./dropdown.module.css";

export default function Dropdown<T extends string | number>({
  label,
  options,
  value,
  onChange,
}: DropdownProps<T>) {
  return (
    <label className={styles.container}>
      {label && <span className={styles.label}>{label}</span>}
      <select
        className={styles.select}
        value={String(value)}
        onChange={(e) => onChange(e.target.value as unknown as T)}
      >
        {options.map((opt) => (
          <option key={String(opt.value)} value={String(opt.value)}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
