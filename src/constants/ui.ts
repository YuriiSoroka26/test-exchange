/**
 * UI-related constants
 */
export const TAB_LABELS = {
  orderbook: "Order Book",
  trades: "Trades",
} as const;

/**
 * Action button labels
 */
export const ACTION_LABELS = {
  action: "Action",
} as const;

/**
 * Dropdown labels
 */
export const DROPDOWN_LABELS = {
  group: "Group",
  coin: "Coin",
} as const;

/**
 * Column headers for order book
 */
export const ORDER_BOOK_HEADERS = {
  price: "Price (USD)",
  size: "Size",
  total: "Total",
} as const;

/**
 * Column headers for trades
 */
export const TRADES_HEADERS = {
  time: "Time",
  price: "Price (USD)",
  size: "Size",
} as const;
