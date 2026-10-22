import { ArrowUpRight } from "lucide-react";
import { site } from "../content";
import { DiscordCard } from "./DiscordCard";
import { Reveal, SectionHead } from "./Reveal";

export function Connect() {
  return (
    <section id="connect" className="mx-auto max-w-6xl px-6 pb-16 pt-28 md:pt-40">
      <SectionHead id="connect" />
      <div className="grid gap-10 md:grid-cols-[1fr_380px]">
        <Reveal>
          <ul className="divide-y divide-line border-y border-line">
            {site.links.map(({ label, href, icon: Icon }) => (
              <li key={label}>
                <a href={href} target="_blank" rel="noreferrer" className="group flex items-center justify-between py-5 text-xl tracking-tight">
                  <span className="flex items-center gap-4">
                    <Icon size={20} className="text-muted transition-colors duration-300 group-hover:text-accent" />
                    <span className="link-u">{label}</span>
                  </span>
                  <ArrowUpRight size={20} className="text-muted transition-[translate,color] duration-300 ease-fluid group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg" />
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.1}><DiscordCard /></Reveal>
      </div>
      <footer className="mt-24 flex items-center justify-between border-t border-line pt-6 font-mono text-xs text-muted">
        <span>© {new Date().getFullYear()} {site.name}</span>
        <a href="#top" className="link-u hover:text-fg">Back to top</a>
      </footer>
    </section>
  );
}
