import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { laptop, peripherals, rig } from "../data/gear";
import { ease, spring } from "../motion";
import { Reveal, SectionHead } from "./Reveal";

const label = "font-mono text-[11px] uppercase tracking-[0.18em] text-muted";

function LaptopLine() {
  return (
    <svg viewBox="0 0 320 190" className="my-6 w-full text-fg/30" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden>
      <rect x="62" y="14" width="196" height="124" rx="8" />
      <rect x="72" y="24" width="176" height="104" rx="3" className="text-fg/40" />
      <path d="M30 146h260l-14 24a8 8 0 0 1-7 4H51a8 8 0 0 1-7-4z" />
      <path d="M136 146h48" /><circle cx="160" cy="19" r="1.5" />
    </svg>
  );
}

export function Hardware() {
  return (
    <section id="setup" className="mx-auto max-w-6xl px-6 py-28 md:py-40">
      <SectionHead id="setup" />
      <Reveal>
        <div className="grid overflow-hidden rounded-2xl border border-line bg-surface md:grid-cols-[300px_1fr]">
          <div className="flex flex-col justify-between border-b border-line p-6 md:border-b-0 md:border-r">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">Primary machine</p>
            <LaptopLine />
            <div><p className="text-xl font-semibold tracking-tight">{laptop.name}</p><p className="mt-1 font-mono text-xs text-muted">Laptop · development &amp; gaming</p></div>
          </div>
          <div className="grid gap-px bg-line sm:grid-cols-3">
            {laptop.groups.map((g) => (
              <div key={g.label} className="group bg-surface p-6 transition-colors duration-300 hover:bg-fg/[0.02]">
                <p className={`${label} transition-colors duration-300 group-hover:text-accent`}>{g.label}</p>
                {g.items.map((it) => (
                  <div key={it.k} className="mt-5">
                    <p className="font-mono text-[11px] text-muted">{it.k}</p>
                    <p className="mt-1 leading-snug">{it.v}</p>
                    {it.state && (
                      <span className={`mt-2 inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[10px] ${it.state === "active" ? "border-accent/40 text-accent" : "border-dashed border-line text-muted"}`}>
                        <span className={`size-1.5 rounded-full ${it.state === "active" ? "bg-accent" : "border border-muted"}`} />{it.state === "active" ? "In use" : "Kept disabled"}
                      </span>
                    )}
                  </div>
                ))}
                {g.note && <p className="mt-5 text-xs leading-relaxed text-muted">{g.note}</p>}
              </div>
            ))}
          </div>
        </div>
      </Reveal>
      <ul className="mt-4 grid gap-4 sm:grid-cols-3">
        {peripherals.map((p, i) => (
          <Reveal as="li" key={p.name} delay={i * 0.08}>
            <div className="group h-full rounded-2xl border border-line bg-surface p-6 transition-[translate,border-color] duration-500 ease-fluid hover:-translate-y-1 hover:border-fg/25">
              <p.icon size={26} strokeWidth={1.25} className="text-muted transition-colors duration-300 group-hover:text-accent" />
              <p className={`mt-8 ${label}`}>{p.kind}</p>
              <p className="mt-1 text-lg font-medium tracking-tight">{p.name}</p>
              <p className="mt-4 border-t border-line pt-3 font-mono text-[11px] text-muted">{p.role}</p>
            </div>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}

const wave = Array.from({ length: 93 }, (_, i) => `${i ? "L" : "M"}${40 + i * 5} ${100 + Math.sin(i / 3.2) * 22 * Math.sin((i / 92) * Math.PI)}`).join(" ");

function Fretboard({ tab }: { tab: string }) {
  return (
    <svg viewBox="0 0 520 200" className="w-full" fill="none" aria-hidden>
      {[0, 1, 2, 3, 4, 5, 6].map((i) => <line key={i} x1={40 + i * 70} x2={40 + i * 70} y1={20} y2={180} className="stroke-fg/10" strokeWidth={i === 0 ? 3 : 1} />)}
      {[1, 3].map((i) => <circle key={i} cx={40 + i * 70 + 105} cy={100} r={4} className="fill-fg/10" />)}
      {[30, 58, 86, 114, 142, 170].map((y, i) => (
        <motion.line key={y} x1={40} x2={500} y1={y} y2={y} strokeWidth={0.8 + i * 0.25} className="stroke-steel" animate={{ opacity: tab === "guitar" ? 0.7 : 0.22 }} transition={{ duration: 0.5, ease }} />
      ))}
      <motion.path key={tab} d={wave} strokeWidth={1.3} className="stroke-accent" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 1.4, ease }} />
    </svg>
  );
}

export function Guitar() {
  const [tab, setTab] = useState<"guitar" | "amp">("guitar");
  const d = rig[tab];
  return (
    <section id="guitar" className="mx-auto max-w-6xl px-6 py-28 md:py-40">
      <SectionHead id="guitar" />
      <div className="grid gap-4 md:grid-cols-[1.25fr_1fr]">
        <Reveal>
          <div className="flex h-full flex-col justify-between rounded-2xl border border-line bg-surface p-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-steel">Guitar → Amplifier</p>
            <Fretboard tab={tab} />
            <p className="font-mono text-[11px] text-muted">Strings · Waves</p>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="h-full rounded-2xl border border-line bg-surface p-6">
            <div role="tablist" aria-label="Gear" className="mb-6 inline-flex rounded-full border border-line p-1">
              {(["guitar", "amp"] as const).map((t) => (
                <button key={t} type="button" role="tab" aria-selected={tab === t} onClick={() => setTab(t)}
                  className={`relative isolate rounded-full px-4 py-1.5 text-sm transition-colors duration-200 ${tab === t ? "text-fg" : "text-muted hover:text-fg"}`}>
                  {tab === t && <motion.span layoutId="rig-tab" transition={spring} className="absolute inset-0 -z-10 rounded-full bg-accent/12 ring-1 ring-accent/35" />}
                  {rig[t].label}
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.28, ease }}>
                <h3 className="text-2xl font-semibold tracking-tight">{d.title}</h3>
                <div className="mt-5">
                  {d.fields.map(([k, v]) => (
                    <div key={k} className="border-t border-line py-3">
                      <p className={label}>{k}</p>
                      {v ? <p className="mt-1">{v}</p> : <span className="mt-1.5 inline-block rounded-full border border-dashed border-line px-2.5 py-0.5 font-mono text-[11px] text-muted">to confirm</span>}
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
