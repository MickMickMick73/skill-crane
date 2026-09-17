export type PrizeKind = "plush" | "capsule" | "glass" | "tin" | "jackpot";

export type PrizeDef = {
  id: string;
  name: string;
  kind: PrizeKind;
  value: number;
  weight: number;
  grip: number;
  fill: number;
};

export const PIT_FILL: PrizeDef[] = [
  { id: "dust-bear", name: "dust bear", kind: "plush", value: 12, weight: 0.55, grip: 0.7, fill: 3 },
  { id: "salt-cat", name: "salt cat", kind: "plush", value: 14, weight: 0.5, grip: 0.68, fill: 2 },
  { id: "pier-fish", name: "pier fish", kind: "plush", value: 10, weight: 0.4, grip: 0.62, fill: 3 },
  { id: "blue-capsule", name: "blue capsule", kind: "capsule", value: 8, weight: 0.25, grip: 0.5, fill: 4 },
  { id: "red-capsule", name: "red capsule", kind: "capsule", value: 9, weight: 0.28, grip: 0.48, fill: 3 },
  { id: "marble", name: "sea marble", kind: "glass", value: 18, weight: 0.35, grip: 0.35, fill: 2 },
  { id: "bottle", name: "tide bottle", kind: "glass", value: 22, weight: 0.45, grip: 0.32, fill: 1 },
  { id: "tin-car", name: "tin car", kind: "tin", value: 16, weight: 0.6, grip: 0.55, fill: 2 },
  { id: "tin-key", name: "tin key", kind: "tin", value: 15, weight: 0.4, grip: 0.45, fill: 2 },
  { id: "coin-tin", name: "coin tin", kind: "tin", value: 20, weight: 0.5, grip: 0.5, fill: 1 },
  { id: "goldfish", name: "goldfish bag", kind: "plush", value: 28, weight: 0.3, grip: 0.4, fill: 1 },
  { id: "jackpot-watch", name: "watch", kind: "jackpot", value: 50, weight: 0.7, grip: 0.28, fill: 1 },
];

export type PitPrize = {
  def: PrizeDef;
  x: number;
  y: number;
};

export function fillPit(rand: () => number): PitPrize[] {
  const out: PitPrize[] = [];
  for (const def of PIT_FILL) {
    for (let i = 0; i < def.fill; i++) {
      out.push({
        def,
        x: 0.12 + rand() * 0.76,
        y: 0.35 + rand() * 0.55,
      });
    }
  }
  return out;
}
