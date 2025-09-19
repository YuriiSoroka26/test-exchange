/**
 * Type guard to check if a value is an object
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/**
 * Type guard to check if a message is an L2BookMessage
 */
export function isL2BookMessage(
  msg: unknown
): msg is import("../types/l2-book-message").L2BookMessage {
  if (!isObject(msg)) return false;
  if ((msg as Record<string, unknown>).channel !== "l2Book") return false;
  const data = (msg as Record<string, unknown>).data as unknown;
  if (!isObject(data)) return false;
  const levels = (data as Record<string, unknown>).levels as unknown;
  return (
    Array.isArray(levels) &&
    Array.isArray((levels as unknown[])[0]) &&
    Array.isArray((levels as unknown[])[1])
  );
}

/**
 * Type guard to check if a message is a TradesMessage
 */
export function isTradesMessage(
  msg: unknown
): msg is import("../types/trades-message").TradesMessage {
  if (!isObject(msg)) return false;
  if ((msg as Record<string, unknown>).channel !== "trades") return false;
  const data = (msg as Record<string, unknown>).data as unknown;
  return Array.isArray(data);
}
