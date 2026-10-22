import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { sections, site } from "../content";
import { spring } from "../motion";
import { Controls } from "./Controls";

const ids = ["top", ...sections.map((s) => s.id)];

function useActive() {
  const [active, setActive] = useState("top");
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ids.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);
  return active;
}

export function Nav() {
  const active = useActive();
  const { scrollY } = useScroll();
  const bg = useTransform(scrollY, [0, 80], [0, 1]);

  return (
    <>
      <a href="#work" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-fg focus:px-4 focus:py-2 focus:text-bg">Skip to content</a>
      <header className="fixed inset-x-0 top-0 z-40">
        <motion.span aria-hidden style={{ opacity: bg }} className="absolute inset-0 -z-10 border-b border-line bg-bg" />
        <nav aria-label="Primary" className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <a href="#top" className="flex items-center gap-2 text-sm font-semibold tracking-tight">
            <span className="size-1.5 rounded-full bg-accent" />{site.name}
          </a>
          <div className="flex items-center">
            <ul className="hidden items-center md:flex">
              {sections.map(({ id, label }) => (
                <li key={id}>
                  <a href={`#${id}`} aria-current={active === id ? "true" : undefined}
                    className="relative isolate block rounded-full px-3 py-1.5 text-sm text-muted transition-colors duration-200 hover:text-fg aria-[current=true]:text-fg">
                    {active === id && <motion.span layoutId="nav-pill" transition={spring} className="absolute inset-0 -z-10 rounded-full bg-fg/[0.08]" />}
                    {label}
                  </a>
                </li>
              ))}
            </ul>
            <Controls />
          </div>
        </nav>
      </header>
    </>
  );
}
