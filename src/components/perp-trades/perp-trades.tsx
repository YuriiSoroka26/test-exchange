import { useCallback, useMemo, useRef, useState } from "react";
import { fetchUserFills } from "@app/services/hyperliquid";
import { reconstructCompletedPerpTrades } from "@app/services/reconstruct";
import type { CompletedPerpTrade } from "@app/types";
import { formatUsd, formatTime, formatDuration } from "@app/utils";
import styles from "./perp-trades.module.css";

export default function PerpTrades() {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trades, setTrades] = useState<CompletedPerpTrade[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const abortRef = useRef<AbortController | null>(null);

  const tradesPerPage = 10;

  const disabled = useMemo(
    () => loading || address.trim().length === 0,
    [loading, address]
  );

  const totalPages = Math.ceil(trades.length / tradesPerPage);
  const startIndex = (currentPage - 1) * tradesPerPage;
  const endIndex = startIndex + tradesPerPage;
  const currentTrades = trades.slice(startIndex, endIndex);

  const resetPagination = useCallback(() => {
    setCurrentPage(1);
  }, []);

  const goToPage = useCallback(
    (page: number) => {
      setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    },
    [totalPages]
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
      resetPagination();
      try {
        const fills = await fetchUserFills(address.trim(), controller.signal);
        const completed = reconstructCompletedPerpTrades(fills);
        // Sort newest first by close time
        completed.sort((a, b) => b.closeTime - a.closeTime);
        setTrades(completed);
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch user fills"
        );
      } finally {
        setLoading(false);
      }
    },
    [address, resetPagination]
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
            onChange={e => setAddress(e.target.value)}
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
                {currentTrades.map((t, idx) => (
                  <tr key={startIndex + idx}>
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
        {trades.length > tradesPerPage && (
          <div className={styles.pagination}>
            <button
              className={styles.paginationBtn}
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className={styles.paginationInfo}>
              Page {currentPage} of {totalPages} ({trades.length} total trades)
            </span>
            <button
              className={styles.paginationBtn}
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
