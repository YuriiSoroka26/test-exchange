import { useEffect, useMemo, useState } from "react";
import Layout from "./components/layout";
import HeaderBar from "./components/header-bar";
import OrderBook from "./components/order-book";
import Trades from "./components/trades";
import type { TradeItem } from "./types/trades";
import type { Level } from "./types/order-book";
import type { OrderBookSnapshot } from "./types/hyperliquid";
import type { LastTrade } from "./types/order-book";
import { HyperliquidFeed } from "./services/hyperliquid-feed";
import "./App.css";

type TabKey = "orderbook" | "trades";

function App() {
  const [activeTab, setActiveTab] = useState<TabKey>("orderbook");
  const [tickSize, setTickSize] = useState<number>(0.1);
  const [symbol, setSymbol] = useState<string>("BTC");
  const [symbols] = useState<string[]>(["BTC", "ETH", "SOL"]);
  const [bids, setBids] = useState<Level[]>([]);
  const [asks, setAsks] = useState<Level[]>([]);
  const [trades, setTrades] = useState<TradeItem[]>([]);
  const [lastTrade, setLastTrade] = useState<LastTrade | undefined>();

  // Add some mock data for testing order book display
  useEffect(() => {
    if (bids.length === 0 && asks.length === 0) {
      const mockBids: Level[] = [
        { price: 45000, size: 1.5 },
        { price: 44999, size: 2.3 },
        { price: 44998, size: 0.8 },
        { price: 44997, size: 3.1 },
        { price: 44996, size: 1.2 },
        { price: 44995, size: 2.1 },
        { price: 44994, size: 0.7 },
        { price: 44993, size: 1.9 },
        { price: 44992, size: 3.3 },
        { price: 44991, size: 0.6 },
        { price: 44990, size: 2.8 },
      ];
      const mockAsks: Level[] = [
        { price: 45001, size: 1.1 },
        { price: 45002, size: 2.7 },
        { price: 45003, size: 0.9 },
        { price: 45004, size: 1.8 },
        { price: 45005, size: 2.2 },
        { price: 45006, size: 0.5 },
        { price: 45007, size: 3.4 },
        { price: 45008, size: 1.3 },
        { price: 45009, size: 2.6 },
        { price: 45010, size: 0.8 },
        { price: 45011, size: 1.7 },
      ];
      setBids(mockBids);
      setAsks(mockAsks);
    }
  }, [bids.length, asks.length]);

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
        <OrderBook
          bids={groupedBids}
          asks={groupedAsks}
          tickSize={tickSize}
          symbol={symbol}
          lastTrade={lastTrade}
        />
      ) : (
        <Trades trades={trades} symbol={symbol} />
      )}
    </Layout>
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

export default App;
