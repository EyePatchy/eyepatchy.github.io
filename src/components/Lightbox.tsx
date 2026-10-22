import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { asset } from "../content";
import { ease } from "../motion";
import type { Thumb } from "../thumbnails";

const slide: Variants = {
  in: (d: number) => ({ opacity: 0, x: d * 48, scale: 0.985 }),
  mid: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.4, ease } },
  out: (d: number) => ({ opacity: 0, x: -d * 48, transition: { duration: 0.25, ease } }),
};
const pad = (n: number) => String(n).padStart(2, "0");
const stop = (e: { stopPropagation: () => void }) => e.stopPropagation();

function IconBtn({ label, onClick, children, autoFocus }: { label: string; onClick: () => void; children: ReactNode; autoFocus?: boolean }) {
  return (
    <button type="button" aria-label={label} onClick={onClick} data-autofocus={autoFocus ? "" : undefined}
      className="grid size-11 place-items-center rounded-full border border-line text-muted transition-colors duration-200 hover:border-fg/30 hover:text-fg active:scale-95">
      {children}
    </button>
  );
}

export function Lightbox({ items, index, onIndex }: { items: Thumb[]; index: number | null; onIndex: (i: number | null) => void }) {
  const open = index !== null;
  const [dir, setDir] = useState(1);
  const box = useRef<HTMLDivElement>(null);
  const n = items.length;
  const go = useCallback((d: number) => { setDir(d); onIndex(((index ?? 0) + d + n) % n); }, [index, n, onIndex]);

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    document.documentElement.style.overflow = "hidden";
    box.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    return () => { document.documentElement.style.overflow = ""; prev?.focus(); };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const i = index as number;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onIndex(null);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "Tab") {
        const f = box.current?.querySelectorAll<HTMLElement>("button");
        if (!f?.length) return;
        const first = f[0], lastEl = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); lastEl.focus(); }
        else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", onKey);
    [-1, 1].forEach((d) => { new Image().src = asset(items[(i + d + n) % n].full); }); // warm neighbours
    return () => window.removeEventListener("keydown", onKey);
  }, [open, index, go, items, n, onIndex]);

  const t = items[index ?? 0];
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div key="lightbox" ref={box} role="dialog" aria-modal="true" aria-label="Thumbnail viewer" onClick={() => onIndex(null)}
          className="fixed inset-0 z-50 flex flex-col bg-bg px-4 pb-4 pt-3 sm:px-8"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25, ease }}>
          <div className="flex items-center justify-between py-1 font-mono text-xs text-muted" onClick={stop}>
            <span className="uppercase tracking-[0.18em]">YouTube thumbnails</span>
            <IconBtn label="Close viewer" onClick={() => onIndex(null)} autoFocus><X size={18} /></IconBtn>
          </div>
          <div className="relative grid min-h-0 flex-1 place-items-center overflow-hidden">
            <AnimatePresence initial={false} custom={dir} mode="popLayout">
              <motion.img key={t.id} custom={dir} variants={slide} initial="in" animate="mid" exit="out"
                src={asset(t.full)} alt={`Thumbnail ${t.id} of ${pad(n)}`} width={t.w} height={t.h} decoding="async" draggable={false}
                drag="x" dragSnapToOrigin dragElastic={0.2} onClick={stop}
                onDragEnd={(_, info) => { if (info.offset.x < -60) go(1); else if (info.offset.x > 60) go(-1); }}
                style={{ aspectRatio: `${t.w}/${t.h}`, width: `min(100%, calc((100svh - 9rem) * ${t.w / t.h}))`, backgroundImage: `url(${asset(t.thumb)})`, backgroundSize: "cover" }}
                className="rounded-lg border border-line" />
            </AnimatePresence>
          </div>
          <div className="flex items-center justify-center gap-6 pt-3" onClick={stop}>
            <IconBtn label="Previous thumbnail" onClick={() => go(-1)}><ChevronLeft size={20} /></IconBtn>
            <span className="min-w-16 text-center font-mono text-xs tabular-nums text-muted" aria-live="polite">{pad((index ?? 0) + 1)} / {pad(n)}</span>
            <IconBtn label="Next thumbnail" onClick={() => go(1)}><ChevronRight size={20} /></IconBtn>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
