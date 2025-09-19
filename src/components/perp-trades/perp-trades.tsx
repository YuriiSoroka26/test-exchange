import { useCallback, useMemo, useRef, useState } from "react";
import { fetchUserFills } from "../../services/hyperliquid";
import {
  reconstructCompletedPerpTrades,
  type CompletedPerpTrade,
} from "../../services/reconstruct";
import styles from "./perp-trades.module.css";

function formatUsd(n: number): string {
  const sign = n < 0 ? "-" : "";
  const v = Math.abs(n);
  const str =
    v >= 1000
      ? v.toLocaleString(undefined, { maximumFractionDigits: 2 })
      : v.toFixed(2);
  return `${sign}$${str}`;
}

function formatTime(ms: number): string {
  const d = new Date(ms);
  return d.toLocaleString();
}

function formatDuration(ms: number): string {
  const sec = Math.floor(ms / 1000);
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export default function PerpTrades() {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trades, setTrades] = useState<CompletedPerpTrade[]>([]);
  const abortRef = useRef<AbortController | null>(null);

  const disabled = useMemo(
    () => loading || address.trim().length === 0,
    [loading, address]
  );

  const onSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault?.();
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      setLoading(true);
      setError(null);
      setTrades([]);
      try {
        const fills = await fetchUserFills(address.trim(), controller.signal);
        const completed = reconstructCompletedPerpTrades(fills);
        // Sort newest first by close time
        completed.sort((a, b) => b.closeTime - a.closeTime);
        setTrades(completed);
      } catch (err: any) {
        setError(err?.message || "Failed to fetch user fills");
      } finally {
        setLoading(false);
      }
    },
    [address]
  );

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h2 className={styles.title}>Completed Perpetual Trades</h2>
          <span className={styles.muted}>HyperLiquid</span>
        </div>
        <form onSubmit={onSubmit} className={styles.formRow}>
          <input
            className={styles.input}
            placeholder="Enter wallet address (0x...)"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <button
            type="submit"
            className={styles.btnPrimary}
            disabled={disabled}
          >
            {loading ? "Loading..." : "Load"}
          </button>
        </form>
        {error && <div className={styles.errorBar}>{error}</div>}
        {!loading && trades.length === 0 && !error && (
          <div className={styles.muted}>Enter an address and click Load.</div>
        )}
        {trades.length > 0 && (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Coin</th>
                  <th>Direction</th>
                  <th>Opened</th>
                  <th>Duration</th>
                  <th>Realized PnL</th>
                </tr>
              </thead>
              <tbody>
                {trades.map((t, idx) => (
                  <tr key={idx}>
                    <td>{t.coin}</td>
                    <td>
                      <span
                        className={`${styles.pill} ${
                          t.direction === "long"
                            ? styles.pillLong
                            : styles.pillShort
                        }`}
                      >
                        {t.direction}
                      </span>
                    </td>
                    <td>{formatTime(t.openTime)}</td>
                    <td>{formatDuration(t.durationMs)}</td>
                    <td
                      className={
                        t.realizedPnlUsd >= 0
                          ? styles.pnlPositive
                          : styles.pnlNegative
                      }
                    >
                      {formatUsd(t.realizedPnlUsd)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
