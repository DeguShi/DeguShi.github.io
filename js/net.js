// Background: research (mint) and building (coral) nodes drifting, linked when close, with signals crossing.

const MINT = [45, 212, 191];
const CORAL = [255, 122, 89];
const LINK_DIST = 190;

export function startNet(canvas) {
  const ctx = canvas.getContext("2d");
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let w = 0,
    h = 0,
    nodes = [],
    pulses = [];

  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.round(Math.min(46, (w * h) / 32000));
    nodes = Array.from({ length: count }, (_, i) => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      c: i % 2 ? CORAL : MINT,
      r: 1.6 + Math.random() * 1.6,
    }));
  }

  function links() {
    const out = [];
    for (let i = 0; i < nodes.length; i++)
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i],
          b = nodes[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < LINK_DIST && a.c !== b.c) out.push([a, b, d]);
      }
    return out;
  }

  function frame() {
    ctx.clearRect(0, 0, w, h);
    for (const n of nodes) {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < -20) n.x = w + 20;
      if (n.x > w + 20) n.x = -20;
      if (n.y < -20) n.y = h + 20;
      if (n.y > h + 20) n.y = -20;
    }
    const ls = links();
    for (const [a, b, d] of ls) {
      const alpha = 0.16 * (1 - d / LINK_DIST);
      const g = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
      g.addColorStop(0, `rgba(${a.c},${alpha})`);
      g.addColorStop(1, `rgba(${b.c},${alpha})`);
      ctx.strokeStyle = g;
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 6]);
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }
    ctx.setLineDash([]);
    if (ls.length && Math.random() < 0.04 && pulses.length < 14) {
      const [a, b] = ls[Math.floor(Math.random() * ls.length)];
      pulses.push({ a, b, t: 0 });
    }
    pulses = pulses.filter((p) => (p.t += 0.012) < 1);
    for (const p of pulses) {
      const x = p.a.x + (p.b.x - p.a.x) * p.t,
        y = p.a.y + (p.b.y - p.a.y) * p.t;
      ctx.fillStyle = `rgba(${p.a.c},${0.7 * Math.sin(Math.PI * p.t)})`;
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
    for (const n of nodes) {
      ctx.fillStyle = `rgba(${n.c},.45)`;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    }
    if (!still) requestAnimationFrame(frame);
  }

  addEventListener("resize", resize);
  resize();
  frame();
}
