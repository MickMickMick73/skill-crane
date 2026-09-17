import { BRASS, CABINET, CHUTE, GLASS, LAMP, PIT, PLUSH, SIGN } from "./palette";
import type { Run } from "./rules";

export type View = {
  clawX: number;
  dropping: boolean;
  dropY: number;
};

function lumpy(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, kind: string) {
  ctx.beginPath();
  const n = kind === "plush" ? 7 : 5;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const k = r * (0.78 + ((i * 17) % 5) * 0.05);
    const px = x + Math.cos(a) * k;
    const py = y + Math.sin(a) * k * 0.9;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

export function paint(ctx: CanvasRenderingContext2D, run: Run, view: View) {
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;
  ctx.fillStyle = "#0e1210";
  ctx.fillRect(0, 0, w, h);

  const box = { x: 80, y: 36, w: 800, h: 520 };
  ctx.fillStyle = CABINET;
  ctx.fillRect(box.x, box.y, box.w, box.h);
  ctx.fillStyle = "#24483e";
  ctx.fillRect(box.x + 18, box.y + 18, box.w - 36, 48);
  ctx.fillStyle = SIGN;
  ctx.font = "22px Georgia, serif";
  ctx.save();
  ctx.translate(box.x + 40, box.y + 50);
  ctx.rotate(-0.03);
  ctx.fillText("SKILL CRANE", 0, 0);
  ctx.restore();

  const pit = { x: box.x + 40, y: box.y + 80, w: box.w - 200, h: 360 };
  ctx.fillStyle = PIT;
  ctx.fillRect(pit.x, pit.y, pit.w, pit.h);

  ctx.fillStyle = LAMP;
  ctx.beginPath();
  ctx.arc(pit.x + pit.w * 0.38, pit.y + 18, 10, 0, Math.PI * 2);
  ctx.fill();

  for (const p of run.pit) {
    const px = pit.x + p.x * pit.w;
    const py = pit.y + p.y * pit.h;
    if (p.def.kind === "plush") ctx.fillStyle = PLUSH;
    else if (p.def.kind === "capsule") ctx.fillStyle = CHUTE;
    else if (p.def.kind === "glass") ctx.fillStyle = GLASS;
    else if (p.def.kind === "jackpot") ctx.fillStyle = BRASS;
    else ctx.fillStyle = "#6a6a62";
    lumpy(ctx, px, py, 11 + p.def.weight * 6, p.def.kind);
    ctx.fill();
  }

  const chute = { x: box.x + box.w - 150, y: box.y + 200, w: 110, h: 220 };
  ctx.fillStyle = CHUTE;
  ctx.fillRect(chute.x, chute.y, chute.w, chute.h);
  ctx.fillStyle = PIT;
  ctx.fillRect(chute.x + 16, chute.y + 16, chute.w - 32, chute.h - 32);

  const cx = pit.x + view.clawX * pit.w;
  const cy = view.dropping ? pit.y + 30 + view.dropY * (pit.h - 70) : pit.y + 28;
  ctx.strokeStyle = BRASS;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cx, pit.y);
  ctx.lineTo(cx, cy);
  ctx.stroke();
  ctx.strokeStyle = "#c9c2b0";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(cx - 14 - run.crane.prongs * 2, cy + 16);
  ctx.lineTo(cx, cy);
  ctx.lineTo(cx + 14 + run.crane.prongs * 2, cy + 16);
  ctx.stroke();

  ctx.strokeStyle = "rgba(180,200,210,0.28)";
  ctx.lineWidth = 2;
  ctx.strokeRect(pit.x + 4, pit.y + 4, pit.w - 8, pit.h - 8);
  ctx.beginPath();
  ctx.moveTo(pit.x + 80, pit.y + 40);
  ctx.lineTo(pit.x + 210, pit.y + 70);
  ctx.stroke();

  ctx.fillStyle = SIGN;
  ctx.font = "16px Georgia, serif";
  ctx.fillText(`round ${run.round} / 3`, box.x + 24, box.y + box.h - 18);
  ctx.fillText(`drops ${run.dropsLeft}`, box.x + 170, box.y + box.h - 18);
  ctx.fillText(`score ${run.score} / ${run.quota}`, box.x + 280, box.y + box.h - 18);
  ctx.fillStyle = LAMP;
  ctx.fillText(run.lastTalk, box.x + 24, h - 28);
}
