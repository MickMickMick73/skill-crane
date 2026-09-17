import { stock } from "./rules";
import type { Run } from "./rules";

export function renderCounter(el: HTMLElement, run: Run, onBuy: (id: string) => void, onNext: () => void) {
  const items = stock()
    .filter((i) => !run.owned.includes(i.id))
    .slice(0, 6);
  el.hidden = false;
  el.innerHTML = "";
  const h = document.createElement("p");
  h.textContent = run.over ? `Tickets: ${run.tickets}. That's you done.` : "Counter. One thing. Then back.";
  el.appendChild(h);
  for (const it of items) {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = `${it.name} — ${it.cost}`;
    b.disabled = run.score < it.cost || run.over;
    b.addEventListener("click", () => onBuy(it.id));
    el.appendChild(b);
  }
  const n = document.createElement("button");
  n.type = "button";
  n.textContent = run.over ? "again" : "next round";
  n.addEventListener("click", onNext);
  el.appendChild(n);
}

export function hideCounter(el: HTMLElement) {
  el.hidden = true;
  el.innerHTML = "";
}
