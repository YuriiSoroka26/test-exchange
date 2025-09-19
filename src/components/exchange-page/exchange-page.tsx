import { useEffect, useMemo, useState } from "react";
import Layout from "../layout";
import HeaderBar from "../header-bar";
import OrderBook from "../order-book";
import OrderBookSkeleton from "../order-book/order-book-skeleton";
import Trades from "../trades";
import TradesSkeleton from "../trades/trades-skeleton";
import type {
  TradeItem,
  Level,
  OrderBookSnapshot,
  LastTrade,
  TabKey,
} from "../../types";
import { HyperliquidFeed } from "../../services/hyperliquid-feed";
import { DEFAULT_SYMBOLS, DEFAULT_TICK_SIZE } from "../../constants";
import { groupLevels } from "../../utils";

export default function ExchangePage() {
  const [activeTab, setActiveTab] = useState<TabKey>("orderbook");
  const [tickSize, setTickSize] = useState<number>(DEFAULT_TICK_SIZE);
  const [symbol, setSymbol] = useState<string>("BTC");
  const [symbols] = useState<string[]>(DEFAULT_SYMBOLS);
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
