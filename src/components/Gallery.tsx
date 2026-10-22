import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { asset } from "../content";
import { thumbnails } from "../thumbnails";
import { Lightbox } from "./Lightbox";
import { Reveal } from "./Reveal";

export function Gallery() {
  const [open, setOpen] = useState<number | null>(null);
  const n = thumbnails.length;
  return (
    <>
      <ul className="group/grid grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line lg:grid-cols-4">
        {thumbnails.map((t, i) => (
          <Reveal as="li" key={t.id} delay={Math.min(i, 7) * 0.04} className={i === 0 ? "col-span-2 lg:row-span-2" : ""}>
            <button type="button" onClick={() => setOpen(i)} aria-label={`Open thumbnail ${i + 1} of ${n}`}
              style={{ aspectRatio: `${t.w}/${t.h}` }}
              className="group relative block w-full overflow-hidden bg-surface transition-opacity duration-300 group-hover/grid:opacity-50 hover:opacity-100! focus-visible:opacity-100!">
              <img src={asset(t.thumb)} width={t.w} height={t.h} alt="" loading={i < 5 ? "eager" : "lazy"} decoding="async"
                sizes={i === 0 ? "(min-width:1024px) 576px, 100vw" : "(min-width:1024px) 288px, 50vw"}
                className="size-full object-cover transition-[scale] duration-700 ease-fluid group-hover:scale-[1.03]" />
              <span className="absolute left-2.5 top-2.5 rounded bg-bg/85 px-1.5 py-0.5 font-mono text-[10px] text-fg opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">{t.id}</span>
            </button>
          </Reveal>
        ))}
        <li className="aspect-video bg-surface">
          <button type="button" onClick={() => setOpen(0)} className="group flex size-full flex-col justify-between p-4 text-left transition-colors duration-300 hover:bg-fg/[0.03]">
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">{n} designs</span>
            <span className="flex items-center gap-2 text-sm">Open viewer <ArrowUpRight size={16} className="text-accent transition-[translate] duration-300 ease-fluid group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></span>
          </button>
        </li>
      </ul>
      <Lightbox items={thumbnails} index={open} onIndex={setOpen} />
    </>
  );
}
