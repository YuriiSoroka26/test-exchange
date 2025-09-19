import { useEffect, useMemo, useState } from "react";
import Layout from "../layout";
import HeaderBar from "../header-bar";
import OrderBook from "../order-book";
import OrderBookSkeleton from "../order-book/order-book-skeleton";
import Trades from "../trades";
import TradesSkeleton from "../trades/trades-skeleton";
import type { TradeItem } from "../../types/trades";
import type { Level } from "../../types/order-book";
import type { OrderBookSnapshot } from "../../types/hyperliquid";
import type { LastTrade } from "../../types/order-book";
import { HyperliquidFeed } from "../../services/hyperliquid-feed";

type TabKey = "orderbook" | "trades";

export default function ExchangePage() {
  const [activeTab, setActiveTab] = useState<TabKey>("orderbook");
  const [tickSize, setTickSize] = useState<number>(0.1);
  const [symbol, setSymbol] = useState<string>("BTC");
  const [symbols] = useState<string[]>(["BTC", "ETH", "SOL"]);
  const [bids, setBids] = useState<Level[]>([]);
  const [asks, setAsks] = useState<Level[]>([]);
  const [trades, setTrades] = useState<TradeItem[]>([]);
  const [lastTrade, setLastTrade] = useState<LastTrade | undefined>();

  useEffect(() => {
    const wsUrl = (
      import.meta as unknown as { env?: { VITE_HYPERLIQUID_WS_URL?: string } }
    ).env?.VITE_HYPERLIQUID_WS_URL;
    if (!wsUrl) {
      console.warn("VITE_HYPERLIQUID_WS_URL not set. Skipping WS connection.");
      return;
    }
    const feed = new HyperliquidFeed(wsUrl);
    feed.connect(symbol);
    const offBook = feed.onOrderBook((snap: OrderBookSnapshot) => {
      console.log("Order book data received:", snap);
      setBids(snap.bids.map(([p, s]) => ({ price: p, size: s })));
      setAsks(snap.asks.map(([p, s]) => ({ price: p, size: s })));
    });
    const offTrades = feed.onTrades((ts) => {
      const newTrades = ts.map((t) => ({
        time: t.time,
        price: t.price,
        size: t.size,
        side: t.side,
      }));

      setTrades((prev) => [...newTrades, ...prev].slice(0, 100));

      // Update last trade with the most recent trade
      if (newTrades.length > 0) {
        const mostRecentTrade = newTrades[0];
        setLastTrade({
          price: mostRecentTrade.price,
          side: mostRecentTrade.side,
        });
      }
    });
    return () => {
      offBook();
      offTrades();
      feed.disconnect();
    };
  }, [symbol]);

  const groupedBids = useMemo(
    () => groupLevels(bids, tickSize, "down"),
    [bids, tickSize]
  );
  const groupedAsks = useMemo(
    () => groupLevels(asks, tickSize, "up"),
    [asks, tickSize]
  );

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        minHeight: "100%",
        padding: "20px",
      }}
    >
      <Layout
        header={
          <HeaderBar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onAction={() => {}}
            tickSize={tickSize}
            onTickSizeChange={setTickSize}
            symbol={symbol}
            symbols={symbols}
            onSymbolChange={setSymbol}
          />
        }
      >
        {activeTab === "orderbook" ? (
          groupedBids.length > 0 && groupedAsks.length > 0 ? (
            <OrderBook
              bids={groupedBids}
              asks={groupedAsks}
              tickSize={tickSize}
              symbol={symbol}
              lastTrade={lastTrade}
            />
          ) : (
            <OrderBookSkeleton />
          )
        ) : trades.length > 0 ? (
          <Trades trades={trades} symbol={symbol} />
        ) : (
          <TradesSkeleton />
        )}
      </Layout>
    </div>
  );
}

function groupLevels(
  levels: Level[],
  tickSize: number,
  direction: "up" | "down"
): Level[] {
  if (levels.length === 0) return [];

  const buckets = new Map<number, number>();

  for (const { price, size } of levels) {
    // Binance-style grouping: round to the nearest tick
    const grouped = Math.round(price / tickSize) * tickSize;
    const key = Number(grouped.toFixed(10));
    buckets.set(key, (buckets.get(key) || 0) + size);
  }

  const res = Array.from(buckets.entries()).map(([price, total]) => ({
    price,
    size: total,
  }));

  // Sort based on direction
  res.sort((a, b) =>
    direction === "up" ? a.price - b.price : b.price - a.price
  );

  // Return top 11 levels for display
  return res.slice(0, 11);
}
