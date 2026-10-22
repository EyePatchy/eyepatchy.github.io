import { showcase } from "../content";
import { thumbnails } from "../thumbnails";
import { Gallery } from "./Gallery";
import { Reveal, SectionHead } from "./Reveal";

const k = "font-mono text-[11px] uppercase tracking-[0.18em] text-muted";

export function Work() {
  return (
    <section id="work" className="mx-auto max-w-6xl px-6 py-28 md:py-40">
      <SectionHead id="work" />
      <Reveal className="mb-8 grid gap-8 md:grid-cols-12 md:items-end">
        <div className="md:col-span-7">
          <h3 className="text-3xl font-semibold tracking-[-0.03em] md:text-4xl">{showcase.title}</h3>
          <p className="mt-3 max-w-md text-muted">{showcase.blurb}</p>
        </div>
        <dl className="grid grid-cols-3 gap-6 border-t border-line pt-4 md:col-span-5">
          <div><dt className={k}>Designs</dt><dd className="mt-1 text-sm">{thumbnails.length}</dd></div>
          <div><dt className={k}>Format</dt><dd className="mt-1 text-sm">{showcase.format}</dd></div>
          <div><dt className={k}>Viewer</dt><dd className="mt-1 text-sm">← → · Esc</dd></div>
        </dl>
      </Reveal>
      <Gallery />
    </section>
  );
}
