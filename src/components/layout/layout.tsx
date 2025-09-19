import type { LayoutProps } from "./layout-props";
import styles from "./layout.module.css";

export default function Layout({ header, children }: LayoutProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>{header}</div>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
