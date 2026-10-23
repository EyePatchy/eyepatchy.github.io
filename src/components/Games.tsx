import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, animate, motion, useInView, useReducedMotion } from "motion/react";
import { games } from "../data/games";
import { ease, spring } from "../motion";
import { Reveal, SectionHead } from "./Reveal";

const view = { once: true, margin: "0px 0px -12% 0px" } as const;

function Panel({ tag, title, children }: { tag: string; title: string; children: ReactNode }) {
  return (
    <article className="relative h-full overflow-hidden rounded-2xl border border-line bg-surface p-6 md:p-8">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">{tag}</p>
      <h3 className="mt-3 text-2xl font-semibold tracking-tight">{title}</h3>
      {children}
    </article>
  );
}

function Minecraft() {
  const [m, setM] = useState(0);
  const { modes } = games.minecraft;
  return (
    <Panel tag="A · Minecraft 1.8.9 PvP" title="Still on 1.8.9.">
      <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-1/2 opacity-70 [background-image:linear-gradient(color-mix(in_srgb,var(--color-fg)_6%,transparent)_1px,transparent_1px),linear-gradient(90deg,color-mix(in_srgb,var(--color-fg)_6%,transparent)_1px,transparent_1px)] [background-size:32px_32px] [mask-image:linear-gradient(to_left,black,transparent)]" />
      <div className="relative mt-8 grid gap-8 md:grid-cols-[auto_1fr] md:items-center md:gap-14">
        <div role="group" aria-label="PvP mode (keys 1 to 4)" className="flex gap-2.5" onKeyDown={(e) => { if (/^[1-4]$/.test(e.key)) setM(+e.key - 1); }}>
          {modes.map((x, i) => (
            <button key={x.name} type="button" aria-pressed={i === m} onClick={() => setM(i)}
              className="relative isolate grid size-14 place-items-center rounded-md border border-line bg-bg font-mono text-[10px] uppercase tracking-wider text-muted transition-colors duration-200 hover:text-fg aria-pressed:text-fg sm:size-24">
              <span className="absolute left-2 top-1.5 opacity-60">{i + 1}</span>{x.short}
              {i === m && <motion.span layoutId="mc-slot" transition={spring} className="absolute -inset-1 -z-10 rounded-lg border-2 border-fg/80" />}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={m} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.28, ease }}>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">Mode 0{m + 1} / 0{modes.length}</p>
            <h4 className="mt-2 text-xl font-medium tracking-tight">{modes[m].name}</h4>
            <p className="mt-2 max-w-md text-muted">{modes[m].blurb}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </Panel>
  );
}

const ticks = Array.from({ length: 50 }, (_, i) => {
  const a = (i / 50) * 2 * Math.PI - Math.PI / 2, r1 = i % 5 === 0 ? 68 : 76;
  return { x1: 100 + r1 * Math.cos(a), y1: 100 + r1 * Math.sin(a), x2: 100 + 90 * Math.cos(a), y2: 100 + 90 * Math.sin(a) };
});

function CounterStrike() {
  const box = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);
  const inView = useInView(box, view);
  const reduce = useReducedMotion();
  useEffect(() => {
    const el = num.current;
    if (!inView || reduce || !el) return;
    const c = animate(0, games.cs.hours, { duration: 1.6, ease, onUpdate: (v) => { el.textContent = (Math.round(v / 10) * 10).toLocaleString("en-US"); } });
    return () => c.stop();
  }, [inView, reduce]);
  return (
    <Panel tag="B · Counter-Strike" title="About 5,000 hours of CS:GO.">
      <div ref={box} className="mt-6 flex flex-col items-start gap-6 lg:flex-row lg:items-center">
        <div className="relative size-44 shrink-0">
          <svg viewBox="0 0 200 200" className="size-full" aria-hidden>
            {ticks.map((t, i) => <motion.line key={i} {...t} strokeWidth={1.5} strokeLinecap="round" className="stroke-accent" initial={{ opacity: 0.15 }} whileInView={{ opacity: 1 }} viewport={view} transition={{ duration: 0.3, delay: 0.2 + i * 0.025 }} />)}
          </svg>
          <div className="absolute inset-0 grid place-content-center text-center">
            <span ref={num} className="text-3xl font-medium tabular-nums tracking-tight">{games.cs.hours.toLocaleString("en-US")}</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">hours</span>
          </div>
        </div>
        <div className="text-sm leading-relaxed text-muted">
          <p>Logged before the move to CS2, so this is a snapshot of my CS:GO days.</p>
          <p className="mt-3">That's roughly 208 days of playtime.</p>
        </div>
      </div>
    </Panel>
  );
}

function HollowKnight() {
  const list = games.hk.pantheons;
  return (
    <Panel tag="C · Hollow Knight" title="Pantheon master.">
      <p className="mt-3 text-sm text-muted">Recorded Pantheon 5 time: <span className="font-mono text-fg">{games.hk.p5}</span>.</p>
      <div className="relative mt-7 pl-8">
        <motion.span aria-hidden className="absolute bottom-3 left-[5px] top-3 w-px origin-top bg-fg/15" initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={view} transition={{ duration: 1.4, ease }} />
        <ul>
          {list.map((name, i) => {
            const last = i === list.length - 1;
            return (
              <motion.li key={name} className="relative flex items-baseline gap-3 py-2.5 text-sm" initial={{ opacity: 0, x: -6 }} whileInView={{ opacity: 1, x: 0 }} viewport={view} transition={{ duration: 0.5, ease, delay: 0.3 + i * 0.18 }}>
                <span aria-hidden className={`absolute -left-8 top-1/2 size-[11px] -translate-y-1/2 rounded-full border ${last ? "border-accent bg-accent shadow-[0_0_24px_color-mix(in_srgb,var(--color-accent)_45%,transparent)]" : "border-fg/40 bg-surface"}`} />
                <span className="font-mono text-[11px] text-muted">P{i + 1}</span>
                <span className={last ? "text-fg" : "text-muted"}>Pantheon of {name}</span>
                {last && <span className="ml-auto font-mono text-xs text-accent">{games.hk.p5}</span>}
              </motion.li>
            );
          })}
        </ul>
      </div>
    </Panel>
  );
}

export function Games() {
  return (
    <section id="games" className="mx-auto max-w-6xl px-6 py-28 md:py-40">
      <SectionHead id="games" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Reveal className="md:col-span-2"><Minecraft /></Reveal>
        <Reveal><CounterStrike /></Reveal>
        <Reveal delay={0.1}><HollowKnight /></Reveal>
      </div>
    </section>
  );
}
