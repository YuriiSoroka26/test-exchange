import type { HyperliquidFill, UserFillsResponse } from "@app/types";
import { HYPERLIQUID_INFO_URL } from "@app/constants";

async function fetchUserFillsByTime(
  walletAddress: string,
  signal?: AbortSignal,
  startTime: number = 0,
  endTime?: number
): Promise<HyperliquidFill[]> {
  const allFills: HyperliquidFill[] = [];
  let currentStartTime = startTime;
  const maxIterations = 100;
  let iterations = 0;

  while (iterations < maxIterations) {
    const body = {
      type: "userFillsByTime",
      user: walletAddress,
      startTime: currentStartTime,
      aggregateByTime: true,
      ...(endTime && { endTime }),
    };

    const res = await fetch(HYPERLIQUID_INFO_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal,
    });

    if (!res.ok) {
      throw new Error(
        `HyperLiquid userFillsByTime error: ${res.status} ${res.statusText}`
      );
    }

    const data = await res.json();
    let fills: HyperliquidFill[] = [];

    if (Array.isArray(data)) {
      fills = data as HyperliquidFill[];
    } else if (data && Array.isArray((data as UserFillsResponse).fills)) {
      fills = (data as UserFillsResponse).fills;
    } else if (data && data.data && Array.isArray(data.data)) {
      fills = data.data as HyperliquidFill[];
    }

    if (fills.length === 0) {
      break;
    }

    allFills.push(...fills);

    const lastFillTime = Math.max(...fills.map(f => f.time));
    if (lastFillTime <= currentStartTime) {
      break;
    }
    currentStartTime = lastFillTime + 1;

    if (fills.length < 1000) {
      break;
    }

    iterations++;
  }

  console.log(
    `userFillsByTime completed after ${iterations + 1} iterations with ${allFills.length} total fills`
  );
  return allFills;
}

export async function fetchUserFills(
  walletAddress: string,
  signal?: AbortSignal
): Promise<HyperliquidFill[]> {
  return await fetchUserFillsByTime(walletAddress, signal);
}
