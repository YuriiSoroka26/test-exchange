import { Link, useLocation } from "react-router-dom";
import styles from "./navigation.module.css";

export default function Navigation() {
  const location = useLocation();

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <h1 className={styles.title}>Test Exchange</h1>
        </div>
        <div className={styles.links}>
          <Link
            to="/"
            className={`${styles.link} ${
              location.pathname === "/" ? styles.active : ""
            }`}
          >
            Exchange
          </Link>
          <Link
            to="/perp-trades"
            className={`${styles.link} ${
              location.pathname === "/perp-trades" ? styles.active : ""
            }`}
          >
            Perp Trades
          </Link>
        </div>
      </div>
    </nav>
  );
}
