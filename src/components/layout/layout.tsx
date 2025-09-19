import type { LayoutProps } from "../../types";
import styles from "./layout.module.css";

export default function Layout({ header, children }: LayoutProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>{header}</div>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
