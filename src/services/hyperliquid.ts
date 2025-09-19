// Minimal HyperLiquid Info API client for user fills
// Docs reference: POST https://api.hyperliquid.xyz/info with body { type: "userFills", user: string, aggregateByTime?: boolean }

import type { HyperliquidFill, UserFillsResponse } from "../types";
import { HYPERLIQUID_INFO_URL } from "../constants";

export async function fetchUserFills(
  walletAddress: string,
  signal?: AbortSignal
): Promise<HyperliquidFill[]> {
  const body = {
    type: "userFills",
    user: walletAddress,
    aggregateByTime: true,
  } as const;

  const res = await fetch(HYPERLIQUID_INFO_URL, {
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
