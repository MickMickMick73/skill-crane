import type { Run } from "./rules";

export type Seam = {
  state: () => {
    round: number;
    score: number;
    dropsLeft: number;
    items: string[];
    seed: number;
  };
  drop: (x: number) => void;
};

export function attachQa(get: () => Run, actDrop: (x: number) => void): Seam {
  const seam: Seam = {
    state: () => {
      const r = get();
      return { round: r.round, score: r.score, dropsLeft: r.dropsLeft, items: r.owned.slice(), seed: r.seed };
    },
    drop: (x: number) => actDrop(x),
  };
  (window as unknown as { __game: Seam }).__game = seam;
  return seam;
}
