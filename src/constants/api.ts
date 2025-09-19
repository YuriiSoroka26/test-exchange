/**
 * Hyperliquid API endpoints
 */
export const HYPERLIQUID_INFO_URL =
  import.meta.env.VITE_HYPERLIQUID_INFO_URL ||
  "https://api.hyperliquid.xyz/info";

/**
 * WebSocket connection retry delay in milliseconds
 */
export const WS_RETRY_DELAY =
  Number(import.meta.env.VITE_WS_RETRY_DELAY) || 1000;

/**
 * Maximum number of order book levels to display
 */
export const MAX_ORDER_BOOK_LEVELS =
  Number(import.meta.env.VITE_MAX_ORDER_BOOK_LEVELS) || 50;

/**
 * Maximum number of trades to display
 */
export const MAX_TRADES_DISPLAY =
  Number(import.meta.env.VITE_MAX_TRADES_DISPLAY) || 24;
