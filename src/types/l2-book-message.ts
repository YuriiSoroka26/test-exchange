import type { L2BookData } from "./l2-book-data";

export type L2BookMessage = { channel: "l2Book"; data: L2BookData };
