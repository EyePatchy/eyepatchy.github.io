import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { branches, type Skill } from "../data/skills";
import { asset, site } from "../content";
import { ease } from "../motion";
import { SectionHead, Reveal } from "./Reveal";

const W = 900, H = 540;
const polar = (rx: number, ry: number, a: number) => ({ x: W / 2 + rx * Math.cos(a), y: H / 2 + ry * Math.sin(a) });
const branchById = Object.fromEntries(branches.map((b) => [b.id, b]));
const skillById: Record<string, Skill> = {};
const parent: Record<string, string> = {};
const pos: Record<string, { x: number; y: number }> = {};
const slot = (2 * Math.PI) / branches.reduce((n, b) => n + b.skills.length, 0);
let k = 0;
for (const b of branches) {
  const angles = b.skills.map((s) => {
    skillById[s.id] = s; parent[s.id] = b.id;
    const a = -Math.PI / 2 + (k++ + 0.5) * slot;
    pos[s.id] = polar(385, 215, a);
    return a;
  });
  pos[b.id] = polar(175, 98, angles.reduce((x, y) => x + y, 0) / angles.length);
}
const lineCls = (on: boolean) => `fill-none transition-[stroke] duration-500 ${on ? "stroke-accent pulse-line" : "stroke-line"}`;

function Chip({ on, onClick, children }: { on?: boolean; onClick: () => void; children: string }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={on}
      className={`rounded-full border px-3 py-1 text-xs transition-colors duration-200 ${on ? "border-accent text-fg" : "border-line text-muted hover:border-fg/30 hover:text-fg"}`}>{children}</button>
  );
}

export function SkillTree() {
  const [sel, setSel] = useState("js");
  const [hov, setHov] = useState<string | null>(null);
  const active = hov ?? sel;
  const hub = parent[active] ?? active;
  const links = skillById[active]?.with ?? [];
  const skill = skillById[sel];
  const branch = branchById[parent[sel] ?? sel];
  const at = (id: string) => ({ left: `${(pos[id].x / W) * 100}%`, top: `${(pos[id].y / H) * 100}%` });

  const node = (id: string, label: string, isHub: boolean) => {
    const state = id === active ? "border-accent text-fg" : id === hub || links.includes(id) ? "border-fg/30 text-fg" : "border-line text-muted hover:border-fg/25 hover:text-fg";
    return (
      <motion.button key={id} type="button" style={at(id)} whileTap={{ scale: 0.96 }} aria-pressed={sel === id}
        onClick={() => setSel(id)} onFocus={() => setHov(id)} onBlur={() => setHov(null)}
        onPointerEnter={(e) => e.pointerType === "mouse" && setHov(id)} onPointerLeave={() => setHov(null)}
        className={`absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border transition-[border-color,color] duration-300 ${isHub ? "bg-bg px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em]" : "bg-surface px-3 py-1.5 text-xs"} ${state}`}>
        {label}
      </motion.button>
    );
  };

  return (
    <section id="skills" className="mx-auto max-w-6xl px-6 py-28 md:py-40">
      <SectionHead id="skills" />
      <Reveal>
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="relative hidden aspect-[900/540] min-w-0 self-start rounded-2xl border border-line md:block">
            <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden className="absolute inset-0 size-full">
              {branches.map((b) => (
                <g key={b.id}>
                  <line x1={W / 2} y1={H / 2} x2={pos[b.id].x} y2={pos[b.id].y} strokeWidth={1} vectorEffect="non-scaling-stroke" className={lineCls(b.id === hub)} />
                  {b.skills.map((s) => <line key={s.id} x1={pos[b.id].x} y1={pos[b.id].y} x2={pos[s.id].x} y2={pos[s.id].y} strokeWidth={1} vectorEffect="non-scaling-stroke" className={lineCls(s.id === active || b.id === active)} />)}
                </g>
              ))}
              {skillById[active] && links.map((id) => <line key={id} x1={pos[active].x} y1={pos[active].y} x2={pos[id].x} y2={pos[id].y} strokeWidth={1} strokeDasharray="2 5" vectorEffect="non-scaling-stroke" className="stroke-fg/35" />)}
            </svg>
            <div className="absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center gap-1.5">
              <img src={asset(site.avatar)} alt="" width={56} height={56} className="size-14 rounded-full object-cover ring-1 ring-accent/50" />
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">{site.name}</span>
            </div>
            {branches.map((b) => node(b.id, b.label, true))}
            {branches.flatMap((b) => b.skills.map((s) => node(s.id, s.label, false)))}
            <p className="absolute bottom-3 left-4 font-mono text-[10px] text-muted">Solid lines: structure · dashed: works with</p>
          </div>

          <div className="md:hidden">
            <div className="flex flex-wrap gap-2">{branches.map((b) => <Chip key={b.id} on={branch.id === b.id} onClick={() => setSel(b.skills[0].id)}>{b.label}</Chip>)}</div>
            <div className="mt-3 flex flex-wrap gap-2">{branch.skills.map((s) => <Chip key={s.id} on={sel === s.id} onClick={() => setSel(s.id)}>{s.label}</Chip>)}</div>
          </div>

          <aside className="min-h-[19rem] rounded-2xl border border-line bg-surface p-6" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={sel} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.28, ease }}>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">{skill ? branch.label : "Branch"}</p>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight">{skill ? skill.label : branch.label}</h3>
                {skill ? (
                  <>
                    <p className="mt-3 text-muted">{skill.role}</p>
                    <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">Where I use it</p>
                    <p className="mt-1.5 text-sm leading-relaxed">{skill.used}</p>
                    {skill.with && <><p className="mt-5 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">Works with</p>
                      <div className="mt-2 flex flex-wrap gap-2">{skill.with.map((id) => <Chip key={id} onClick={() => setSel(id)}>{skillById[id].label}</Chip>)}</div></>}
                  </>
                ) : (
                  <>
                    <p className="mt-3 text-muted">{branch.blurb}</p>
                    <div className="mt-5 flex flex-wrap gap-2">{branch.skills.map((s) => <Chip key={s.id} onClick={() => setSel(s.id)}>{s.label}</Chip>)}</div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </aside>
        </div>
      </Reveal>
    </section>
  );
}
