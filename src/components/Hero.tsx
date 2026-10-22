import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { ease } from "../motion";
import { asset, hero, sections, site } from "../content";
import { SpotifyPlayer } from "./Spotify";


function Line({ children, i }: { children: ReactNode; i: number }) {
  return (
    <span className="-mb-[0.14em] block overflow-hidden pb-[0.14em]">
      <motion.span className="block" initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 1, ease, delay: 0.15 + i * 0.1 }}>{children}</motion.span>
    </span>
  );
}
const fade = (delay: number) => ({ initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, ease, delay } });

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section id="top" ref={ref} className="relative flex min-h-svh items-center">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_40%_at_20%_0%,color-mix(in_srgb,var(--color-accent)_9%,transparent),transparent)]" />
      <motion.div style={{ y, opacity }} className="relative mx-auto grid w-full max-w-6xl gap-16 px-6 pb-16 pt-28 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-8 lg:col-span-7">
          <motion.p {...fade(0.05)} className="mb-10 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
            <img src={asset(site.avatar)} alt="" width={32} height={32} decoding="async" className="size-8 rounded-full object-cover ring-1 ring-line" />
            <span className="text-fg">{site.name}</span><span className="h-px w-8 bg-line" />{site.alias}
          </motion.p>
          <h1 className="max-w-[26ch] text-[clamp(1.75rem,3.5vw,2.75rem)] font-medium leading-[1.12] tracking-[-0.032em]">
            <span className="sr-only">{site.name}: </span>
            {hero.lead.map((t, i) => <Line key={t} i={i}>{i === hero.lead.length - 1 ? <>{t}<span className="text-accent">.</span></> : t}</Line>)}
            <motion.span {...fade(0.55)} className="mt-6 block text-[0.62em] font-normal leading-[1.5] tracking-[-0.01em] text-muted">{hero.sub}</motion.span>
          </h1>
          <motion.div {...fade(0.8)} className="mt-10"><SpotifyPlayer /></motion.div>
          <motion.p {...fade(0.95)} className="mt-8 font-mono text-[11px] text-muted">{hero.note}</motion.p>
        </div>
        <motion.nav {...fade(0.7)} aria-label="Sections" className="md:col-span-4 md:self-end lg:col-span-3 lg:col-start-10">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Index</p>
          <ul className="divide-y divide-line border-y border-line">
            {sections.map(({ index: n, label, id }) => (
              <li key={id}>
                <a href={`#${id}`} className="group flex items-baseline gap-4 py-3 text-sm">
                  <span className="font-mono text-[11px] text-muted">{n}</span>
                  <span className="relative">{label}<span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-[scale] duration-500 ease-fluid group-hover:scale-x-100 group-focus-visible:scale-x-100" /></span>
                  <ArrowUpRight size={14} className="ml-auto -translate-x-1 text-accent opacity-0 transition-[translate,opacity] duration-300 ease-fluid group-hover:translate-x-0 group-hover:opacity-100" />
                </a>
              </li>
            ))}
          </ul>
        </motion.nav>
      </motion.div>
    </section>
  );
}
