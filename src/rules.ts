import { COUNTER, type CounterItem } from "./items";
import { fillPit, type PitPrize, type PrizeDef } from "./prizes";
import { mulberry32 } from "./rng";

export const DROPS_PER_ROUND = 5;
export const ROUNDS = 3;
export const QUOTA = [36, 70, 110];

export type Crane = {
  grip: number;
  prongs: number;
};

export type Run = {
  seed: number;
  round: number;
  score: number;
  dropsLeft: number;
  quota: number;
  crane: Crane;
  pit: PitPrize[];
  owned: string[];
  tickets: number;
  over: boolean;
  wonRound: boolean;
  lastTalk: string;
  lastCatch: string;
  valueBonus: number;
};

export function startRun(seed: number): Run {
  const rand = mulberry32(seed);
  return {
    seed,
    round: 1,
    score: 0,
    dropsLeft: DROPS_PER_ROUND,
    quota: QUOTA[0],
    crane: { grip: 0.42, prongs: 2 },
    pit: fillPit(rand),
    owned: [],
    tickets: 0,
    over: false,
    wonRound: false,
    lastTalk: "Five drops. Don't rush the glass.",
    lastCatch: "",
    valueBonus: 0,
  };
}

function holdChance(crane: Crane, prize: PrizeDef, rand: () => number): boolean {
  const prong = 1 + (crane.prongs - 2) * 0.12;
  const p = crane.grip * prize.grip * prong * (1.15 - prize.weight);
  return rand() < Math.min(0.92, Math.max(0.04, p));
}

export function drop(run: Run, x: number): Run {
  if (run.over || run.wonRound || run.dropsLeft <= 0) return run;
  const rand = mulberry32((run.seed + run.round * 997 + run.dropsLeft * 13 + Math.floor(x * 1000)) >>> 0);
  const nx = Math.min(0.95, Math.max(0.05, x));
  let best = -1;
  let bestD = 99;
  for (let i = 0; i < run.pit.length; i++) {
    const d = Math.abs(run.pit[i].x - nx) + Math.abs(run.pit[i].y - 0.55) * 0.35;
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  }
  const next: Run = { ...run, pit: run.pit.slice(), dropsLeft: run.dropsLeft - 1, lastCatch: "" };
  if (best < 0) {
    next.lastTalk = "Empty air. The pit's not that deep.";
    return finishDrop(next);
  }
  const grabbed = next.pit[best];
  if (!holdChance(next.crane, grabbed.def, rand)) {
    next.lastTalk = `Almost had the ${grabbed.def.name}.`;
    return finishDrop(next);
  }
  next.pit.splice(best, 1);
  next.score += grabbed.def.value + next.valueBonus;
  next.lastCatch = grabbed.def.id;
  next.lastTalk = chuteTalk(grabbed.def.name, grabbed.def.value);
  return finishDrop(next);
}

function chuteTalk(name: string, value: number): string {
  if (value >= 40) return `${name}. That's the watch.`;
  if (value >= 20) return `${name}. Chute's happy.`;
  return `${name}. In.`;
}

function finishDrop(run: Run): Run {
  if (run.score >= run.quota) {
    return { ...run, wonRound: true, lastTalk: run.lastTalk + " Quota." };
  }
  if (run.dropsLeft <= 0) {
    return { ...run, over: true, tickets: Math.floor(run.score / 8), lastTalk: "That's the run." };
  }
  return run;
}

export function buy(run: Run, itemId: string): Run {
  const item = COUNTER.find((c) => c.id === itemId);
  if (!item || run.owned.includes(itemId) || run.score < item.cost) return run;
  const crane = { ...run.crane };
  if (item.grip) crane.grip += item.grip;
  if (item.prong) crane.prongs += item.prong;
  const valueBonus = run.valueBonus + (item.valueBonus ?? 0);
  if (item.id === "extra-drop") {
    return {
      ...run,
      crane,
      owned: [...run.owned, itemId],
      score: run.score - item.cost,
      dropsLeft: run.dropsLeft + 1,
      lastTalk: item.talk,
      valueBonus,
    };
  }
  return {
    ...run,
    crane,
    owned: [...run.owned, itemId],
    score: run.score - item.cost,
    lastTalk: item.talk,
    valueBonus,
  };
}

export function nextRound(run: Run): Run {
  if (!run.wonRound || run.round >= ROUNDS) {
    return { ...run, over: true, tickets: Math.floor(run.score / 8) + (run.round >= ROUNDS ? 12 : 0) };
  }
  const rand = mulberry32((run.seed + run.round * 7919) >>> 0);
  const round = run.round + 1;
  return {
    ...run,
    round,
    dropsLeft: DROPS_PER_ROUND,
    quota: QUOTA[round - 1],
    pit: fillPit(rand),
    wonRound: false,
    lastTalk: round === 2 ? "Second round. She gets meaner." : "Last of the three. Don't blink.",
    lastCatch: "",
  };
}

export function stock(): CounterItem[] {
  return COUNTER;
}
