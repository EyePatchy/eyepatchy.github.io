import { useEffect, useRef, useState } from "react";
import { usePrefs, type Theme } from "../lib/prefs";

type Drop = { x: number; y: number; w: number; h: number; s: number };
type Splash = { x: number; up: number; w: number; h: number; s: number; vy: number; life: number };

const COLOR: Record<Theme, number[]> = { dark: [255, 255, 255, 0.85], light: [51, 65, 85, 0.6] };

const FADE_IN = 24;
const FADE_OUT = 42;

export function Rain() {
  const ref = useRef<HTMLCanvasElement>(null);
  const { rain, theme } = usePrefs();
  const live = useRef(rain);
  live.current = rain;
  const themeRef = useRef(theme);
  themeRef.current = theme;
  const [alive, setAlive] = useState(rain);

  useEffect(() => { if (rain) setAlive(true); }, [rain]);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!alive || !canvas || !ctx) return;
    let W = 0, H = 0, docH = 0, sy = 0, raf = 0, last = performance.now(), acc = 0, target = 0, wind = 0, fade = 0;
    const cur = [...COLOR[themeRef.current]];
    const drops: Drop[] = [];
    const splashes: Splash[] = [];

    const measure = () => { docH = document.documentElement.scrollHeight; };
    const onScroll = () => { sy = window.scrollY; };
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      measure(); onScroll();
    };
    const move = (e: PointerEvent) => { target = e.clientX - W / 2; };

    const frame = (t: number) => {
      const k = Math.min(Math.max((t - last) / 16.667, 0), 3);
      last = t;
      fade = Math.min(1, Math.max(0, fade + (live.current ? k / FADE_IN : -k / FADE_OUT)));
      if (!live.current && fade === 0) { setAlive(false); return; }
      raf = requestAnimationFrame(frame);
      const floor = docH - sy;
      const limit = Math.min(floor, H + 40);
      wind += (target - wind) * Math.min(0.06 * k, 1);
      const dir = wind * 0.01 * k;
      const tc = COLOR[themeRef.current];
      for (let i = 0; i < 4; i++) cur[i] += (tc[i] - cur[i]) * Math.min(0.1 * k, 1);
      if (live.current) acc += k * Math.max(1, W / 1100); else acc = 0;
      while (acc >= 1) {
        acc -= 1;
        const s = Math.random() * 7 + 2;
        drops.push({ x: Math.random() * W - wind * 0.01 * (H / (s * 2)) * Math.random(), y: 0, w: s / 3, h: s * 1.2, s });
      }
      ctx.clearRect(0, 0, W, H);
      ctx.globalAlpha = fade;
      ctx.fillStyle = `rgba(${cur[0] | 0},${cur[1] | 0},${cur[2] | 0},${cur[3].toFixed(2)})`;
      for (let i = drops.length - 1; i >= 0; i--) {
        const d = drops[i];
        ctx.fillRect(d.x, d.y, d.w, d.h);
        const before = d.y + d.h;
        d.x += dir; d.y += d.s * 2 * k;
        if (d.y + d.h > limit) {
          if (floor <= H && before <= floor) splashes.push({ x: d.x + Math.random() * 20 - 10, up: 0, w: d.w, h: d.h, s: d.s, vy: 2, life: 60 });
          drops.splice(i, 1);
        }
      }
      for (let i = splashes.length - 1; i >= 0; i--) {
        const p = splashes[i];
        ctx.fillRect(p.x, floor - p.up - p.h / 3, p.w / 3, p.h / 3);
        p.up += ((p.vy * p.s) / 6) * k; p.vy -= 0.1 * k; p.life -= k;
        if (p.life <= 0 || p.up < 0) splashes.splice(i, 1);
      }
    };

    resize();
    raf = requestAnimationFrame(frame);
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      cancelAnimationFrame(raf); ro.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", move);
      ctx.clearRect(0, 0, W, H);
    };
  }, [alive]);

  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-0 size-full" />;
}
