/**
 * Default tick size options for order book grouping
 */
export const TICK_SIZE_OPTIONS = [0.001, 0.01, 0.1, 0.5, 1, 5, 10, 50, 100];

/**
 * Default trading symbols
 */
export const DEFAULT_SYMBOLS = import.meta.env.VITE_DEFAULT_SYMBOLS
  ? import.meta.env.VITE_DEFAULT_SYMBOLS.split(",")
  : ["BTC", "ETH", "SOL", "AVAX", "MATIC"];

/**
 * Default symbol when none is selected
 */
export const DEFAULT_SYMBOL = import.meta.env.VITE_DEFAULT_SYMBOL || "BTC";

/**
 * Default tick size
 */
export const DEFAULT_TICK_SIZE =
  Number(import.meta.env.VITE_DEFAULT_TICK_SIZE) || 0.01;

/**
 * Default number of decimal places for price display
 */
export const DEFAULT_PRICE_DECIMALS = 2;

/**
 * Default number of decimal places for size display
 */
export const DEFAULT_SIZE_DECIMALS = 3;
