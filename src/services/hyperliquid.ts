// Minimal HyperLiquid Info API client for user fills
// Docs reference: POST https://api.hyperliquid.xyz/info with body { type: "userFills", user: string, aggregateByTime?: boolean }

export type HyperliquidFill = {
  time: number; // ms epoch
  coin: string; // e.g., "ETH", "BTC"
  px: number; // price
  sz: number; // size in coin units (positive for buy, negative for sell?)
  dir?: string; // direction label if provided by API
  side?: "B" | "S"; // sometimes side is present
  perp?: boolean; // true for perp trades
  closedPnl?: number; // realized PnL in USD on this fill (if available)
  fee?: number; // fee in USD
};

export type UserFillsResponse = {
  fills: HyperliquidFill[];
};

const INFO_URL = "https://api.hyperliquid.xyz/info";

export async function fetchUserFills(
  walletAddress: string,
  signal?: AbortSignal
): Promise<HyperliquidFill[]> {
  const body = {
    type: "userFills",
    user: walletAddress,
    aggregateByTime: true,
  } as const;

  const res = await fetch(INFO_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal,
  });
  if (!res.ok) {
    throw new Error(`HyperLiquid info error: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();

  // The API often returns an array directly or an object with fills; normalize to array
  if (Array.isArray(data)) {
    return data as HyperliquidFill[];
  }
  if (data && Array.isArray((data as UserFillsResponse).fills)) {
    return (data as UserFillsResponse).fills;
  }
  // Fallback: try to detect nested structure
  if (data && data.data && Array.isArray(data.data)) {
    return data.data as HyperliquidFill[];
  }
  return [];
}
