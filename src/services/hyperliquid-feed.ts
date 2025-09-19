import type {
  MarketSymbol,
  OrderBookSnapshot,
  TradeEvent,
  Listener,
  L2LevelRaw,
  L2BookData,
  L2BookMessage,
  TradeRaw,
  TradesMessage,
} from "../types/hyperliquid";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isL2BookMessage(msg: unknown): msg is L2BookMessage {
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

function isTradesMessage(msg: unknown): msg is TradesMessage {
  if (!isObject(msg)) return false;
  if ((msg as Record<string, unknown>).channel !== "trades") return false;
  const data = (msg as Record<string, unknown>).data as unknown;
  return Array.isArray(data);
}

export class HyperliquidFeed {
  private ws?: WebSocket;
  private url: string;
  private orderBookListeners: Set<Listener<OrderBookSnapshot>> = new Set();
  private tradeListeners: Set<Listener<TradeEvent[]>> = new Set();
  private currentSymbol?: MarketSymbol;

  constructor(url: string) {
    this.url = url;
  }

  connect(symbol: MarketSymbol) {
    this.currentSymbol = symbol;
    this.disconnect();
    this.ws = new WebSocket(this.url);
    this.ws.onopen = () => {
      // Hyperliquid WebSocket subscription format
      const subOrderBook = {
        method: "subscribe",
        subscription: {
          type: "l2Book",
          coin: symbol,
        },
      };
      const subTrades = {
        method: "subscribe",
        subscription: {
          type: "trades",
          coin: symbol,
        },
      };
      this.ws?.send(JSON.stringify(subOrderBook));
      this.ws?.send(JSON.stringify(subTrades));
    };
    this.ws.onmessage = (event: MessageEvent<string>) => {
      try {
        const parsed: unknown = JSON.parse(event.data);

        if (isL2BookMessage(parsed)) {
          const [rawBids, rawAsks] = parsed.data.levels;
          // Get more levels for better grouping (like Binance)
          const bids: Array<[number, number]> = rawBids
            .slice(0, 50)
            .map((l) => [Number(l.px), Number(l.sz)]);
          const asks: Array<[number, number]> = rawAsks
            .slice(0, 50)
            .map((l) => [Number(l.px), Number(l.sz)]);
          const snapshot: OrderBookSnapshot = { bids, asks };
          this.orderBookListeners.forEach((cb) => cb(snapshot));
        }

        if (isTradesMessage(parsed)) {
          const trades: TradeEvent[] = parsed.data.map((t) => ({
            time: t.time ?? Date.now(),
            price: Number(t.px),
            size: Number(t.sz),
            side: t.side === "B" || t.side === "buy" ? "buy" : "sell",
          }));
          this.tradeListeners.forEach((cb) => cb(trades));
        }
      } catch {
        // ignore parse errors
      }
    };
    this.ws.onclose = () => {
      // basic retry if symbol still desired
      if (this.currentSymbol) {
        setTimeout(() => this.connect(this.currentSymbol as string), 1000);
      }
    };
  }

  disconnect() {
    if (this.ws) {
      try {
        this.ws.close();
      } catch (err) {
        // ignore error on close
        void err;
      }
      this.ws = undefined;
    }
  }

  onOrderBook(listener: Listener<OrderBookSnapshot>) {
    this.orderBookListeners.add(listener);
    return () => this.orderBookListeners.delete(listener);
  }

  onTrades(listener: Listener<TradeEvent[]>) {
    this.tradeListeners.add(listener);
    return () => this.tradeListeners.delete(listener);
  }
}
