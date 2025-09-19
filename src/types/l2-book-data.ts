import type { L2LevelRaw } from "./l2-level-raw";

export type L2BookData = {
  coin: string;
  time: number;
  levels: [L2LevelRaw[], L2LevelRaw[]];
};
