import { attachQa } from "./qa";
import { hideCounter, renderCounter } from "./counter";
import { paint, type View } from "./draw";
import { buy, drop, nextRound, startRun, type Run } from "./rules";

const canvas = document.getElementById("cabinet") as HTMLCanvasElement;
const raw = canvas.getContext("2d");
if (!raw) throw new Error("canvas");
const ctx: CanvasRenderingContext2D = raw;
const counterEl = document.getElementById("counter") as HTMLElement;

let run: Run = startRun((Math.random() * 0xffffffff) >>> 0);
const view: View = { clawX: 0.5, dropping: false, dropY: 0 };
const keys = { left: false, right: false };

function showCounter() {
  renderCounter(
    counterEl,
    run,
    (id) => {
      run = buy(run, id);
      showCounter();
    },
    advance,
  );
}

function advance() {
  if (run.over) {
    run = startRun((run.seed + 17) >>> 0);
    hideCounter(counterEl);
    return;
  }
  run = nextRound(run);
  if (run.over) showCounter();
  else hideCounter(counterEl);
}

function doDrop(x: number) {
  if (view.dropping || run.over || run.wonRound) return;
  view.dropping = true;
  view.dropY = 0;
  const start = performance.now();
  const anim = (t: number) => {
    const k = Math.min(1, (t - start) / 420);
    view.dropY = k;
    if (k < 1) requestAnimationFrame(anim);
    else {
      run = drop(run, x);
      view.dropping = false;
      view.dropY = 0;
      if (run.wonRound || run.over) showCounter();
    }
  };
  requestAnimationFrame(anim);
}

if (new URLSearchParams(location.search).get("qa") === "1") {
  attachQa(
    () => run,
    (x) => {
      run = drop(run, x);
      if (run.wonRound || run.over) showCounter();
    },
  );
}

window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" || e.key === "a") keys.left = true;
  if (e.key === "ArrowRight" || e.key === "d") keys.right = true;
  if (e.key === " " || e.key === "Enter") {
    e.preventDefault();
    doDrop(view.clawX);
  }
});
window.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft" || e.key === "a") keys.left = false;
  if (e.key === "ArrowRight" || e.key === "d") keys.right = false;
});
canvas.addEventListener("pointermove", (e) => {
  const r = canvas.getBoundingClientRect();
  const x = (e.clientX - r.left) * (canvas.width / r.width);
  view.clawX = Math.min(0.92, Math.max(0.08, (x - 120) / 640));
});
canvas.addEventListener("pointerdown", () => doDrop(view.clawX));

let last = performance.now();
function tick(now: number) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  if (!view.dropping) {
    if (keys.left) view.clawX = Math.max(0.08, view.clawX - dt * 0.55);
    if (keys.right) view.clawX = Math.min(0.92, view.clawX + dt * 0.55);
  }
  paint(ctx, run, view);
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);
