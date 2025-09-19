import type { HyperliquidFill, UserFillsResponse } from "@app/types";
import { HYPERLIQUID_INFO_URL } from "@app/constants";

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

  if (Array.isArray(data)) {
    return data as HyperliquidFill[];
  }
  if (data && Array.isArray((data as UserFillsResponse).fills)) {
    return (data as UserFillsResponse).fills;
  }
  if (data && data.data && Array.isArray(data.data)) {
    return data.data as HyperliquidFill[];
  }
  return [];
}
