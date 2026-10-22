import { motion } from "motion/react";
import type { ReactNode } from "react";
import { ease } from "../motion";
import { sections } from "../content";

type Props = { children: ReactNode; delay?: number; className?: string; as?: "div" | "li" };

export function Reveal({ children, delay = 0, className, as = "div" }: Props) {
  const M = as === "li" ? motion.li : motion.div;
  return (
    <M
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.8, ease, delay }}
    >
      {children}
    </M>
  );
}

export function SectionHead({ id }: { id: (typeof sections)[number]["id"] }) {
  const s = sections.find((x) => x.id === id)!;
  return (
    <div className="mb-12">
      <Reveal>
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-accent">{s.index} — {s.label}</p>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="max-w-2xl text-balance text-[clamp(1.9rem,4.2vw,3.25rem)] font-semibold leading-[1.05] tracking-[-0.035em]">{s.title}</h2>
      </Reveal>
    </div>
  );
}
