import { describe, expect, it } from "vitest";
import { buy, drop, nextRound, ROUNDS, startRun } from "./rules";

describe("run", () => {
  it("same seed same first drop", () => {
    const a = drop(startRun(42), 0.4);
    const b = drop(startRun(42), 0.4);
    expect(a.score).toBe(b.score);
    expect(a.dropsLeft).toBe(4);
    expect(a.pit.length).toBe(b.pit.length);
  });

  it("different seeds diverge", () => {
    const a = drop(startRun(1), 0.5);
    const b = drop(startRun(2), 0.5);
    expect(a.pit.length !== b.pit.length || a.score !== b.score || a.lastTalk !== b.lastTalk).toBe(true);
  });

  it("cannot buy twice", () => {
    let r = startRun(9);
    r = { ...r, score: 200 };
    r = buy(r, "rubber-tips");
    const g = r.crane.grip;
    r = buy(r, "rubber-tips");
    expect(r.crane.grip).toBe(g);
  });

  it("quota ends the round", () => {
    let r = startRun(3);
    r = { ...r, score: r.quota - 1, pit: [{ def: r.pit[0].def, x: 0.5, y: 0.5 }] };
    r = { ...r, crane: { grip: 1, prongs: 4 } };
    for (let i = 0; i < 8 && !r.wonRound && !r.over; i++) r = drop(r, 0.5);
    expect(r.wonRound || r.over).toBe(true);
  });

  it("three rounds then over", () => {
    let r = startRun(11);
    for (let n = 1; n <= ROUNDS; n++) {
      r = { ...r, score: r.quota, wonRound: true };
      r = nextRound(r);
    }
    expect(r.over).toBe(true);
  });

  it("twenty seeds finish a run", () => {
    for (let s = 1; s <= 20; s++) {
      let r = startRun(s);
      let steps = 0;
      while (!r.over && steps < 80) {
        if (r.wonRound) r = nextRound(r);
        else r = drop(r, 0.18 + (steps % 6) * 0.12);
        steps++;
      }
      expect(r.over).toBe(true);
      expect(steps).toBeLessThan(80);
    }
  });

  it("pit fill raises catch value", () => {
    let r = startRun(4);
    r = { ...r, score: 200 };
    r = buy(r, "plush-dump");
    expect(r.valueBonus).toBe(2);
  });
});
