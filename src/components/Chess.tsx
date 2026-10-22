import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react";
import { chessGame as g } from "../data/chessGame";
import { buildTimeline } from "../lib/chessTimeline";
import { ChessBoard } from "./ChessBoard";

const cap = "font-mono text-[11px] uppercase tracking-[0.18em] text-muted";

function Ctl({ label, onClick, disabled, primary, children }: { label: string; onClick: () => void; disabled?: boolean; primary?: boolean; children: ReactNode }) {
  return (
    <button type="button" aria-label={label} title={label} onClick={onClick} disabled={disabled}
      className={`grid size-11 place-items-center rounded-full border transition-colors duration-200 active:scale-95 disabled:opacity-35 ${primary ? "border-accent text-accent hover:bg-accent/10" : "border-line text-muted hover:border-fg/30 hover:text-fg"}`}>
      {children}
    </button>
  );
}

export default function ChessReplay() {
  const { frames, plies } = useMemo(() => buildTimeline(g.pgn), []);
  const total = plies.length;
  const reduce = useReducedMotion();
  const stage = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLOListElement>(null);
  const inView = useInView(stage, { amount: 0.5 });
  const started = useRef(false);
  const [ply, setPly] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (inView && !started.current) { started.current = true; if (!reduce) setPlaying(true); }
  }, [inView, reduce]);

  useEffect(() => {
    if (!playing || !inView) return;
    if (ply >= total) { setPlaying(false); return; }
    const t = setTimeout(() => setPly((p) => Math.min(p + 1, total)), g.stepMs);
    return () => clearTimeout(t);
  }, [playing, inView, ply, total]);

  useEffect(() => {
    const box = list.current;
    const el = box?.querySelector<HTMLElement>('[aria-current="true"]');
    if (box && el) box.scrollTo({ top: el.offsetTop - box.clientHeight / 2 + el.clientHeight / 2, behavior: reduce ? "auto" : "smooth" });
  }, [ply, reduce]);

  const jump = (p: number) => { setPlaying(false); setPly(Math.max(0, Math.min(total, p))); };
  const step = (d: number) => { setPlaying(false); setPly((p) => Math.max(0, Math.min(total, p + d))); }; // functional update: safe under rapid input
  const toggle = () => { if (playing) setPlaying(false); else { if (ply >= total) setPly(0); setPlaying(true); } };
  const restart = () => { setPly(0); setPlaying(true); };

  const cur = ply ? plies[ply - 1] : null;
  const who = cur?.color === "w" ? "White" : "Black";
  const announce = cur ? `Move ${cur.number}, ${who}: ${cur.san}` : "Starting position";
  const done = ply === total;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center"
      onKeyDown={(e) => { if (e.key === "ArrowLeft") step(-1); else if (e.key === "ArrowRight") step(1); }}>
      <div ref={stage} role="img" aria-label={`Chessboard. ${announce}`} className="relative aspect-[1/0.72] w-full">
        <ChessBoard pieces={frames[ply]} move={cur ?? undefined} moveMs={reduce ? 0.15 : g.moveMs} lift={!reduce} />
      </div>

      <div className="rounded-2xl border border-line bg-surface p-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">{g.event} · {g.round}</p>
        <h3 className="mt-3 text-2xl font-semibold tracking-tight">{g.white} vs. {g.black}</h3>
        <p className="mt-1 font-mono text-xs text-muted">{g.site} · {g.date} · ECO {g.eco}</p>
        <p className="mt-4 text-sm leading-relaxed text-muted">{g.blurb}</p>

        <div className="mt-6 flex items-end justify-between gap-4 border-t border-line pt-5">
          <div>
            <p className={cap}>{cur ? `Move ${cur.number} · ${who}` : "Starting position"}</p>
            <p className="mt-1 font-mono text-3xl tabular-nums tracking-tight">{cur ? `${cur.number}${cur.color === "w" ? "." : "…"} ${cur.san}` : "—"}</p>
          </div>
          <p className="pb-1 font-mono text-xs tabular-nums text-muted">{done ? `${g.result} · Checkmate` : `Ply ${ply} / ${total}`}</p>
        </div>
        <p className="sr-only" aria-live="polite">{announce}</p>

        <div className="mt-5 flex items-center gap-2">
          <Ctl label="Restart game" onClick={restart}><RotateCcw size={18} /></Ctl>
          <Ctl label="Previous move" onClick={() => step(-1)} disabled={ply === 0}><SkipBack size={18} /></Ctl>
          <Ctl label={playing ? "Pause" : done ? "Replay" : "Play"} onClick={toggle} primary>{playing ? <Pause size={18} /> : <Play size={18} />}</Ctl>
          <Ctl label="Next move" onClick={() => step(1)} disabled={done}><SkipForward size={18} /></Ctl>
        </div>
        <input type="range" min={0} max={total} value={ply} onChange={(e) => jump(+e.target.value)} aria-label="Move timeline" aria-valuetext={announce}
          className="mt-5 w-full accent-[var(--color-accent)]" />

        <ol ref={list} aria-label="Moves" className="relative mt-3 max-h-44 overflow-y-auto pr-1">
          {Array.from({ length: Math.ceil(total / 2) }, (_, i) => (
            <li key={i} className="grid grid-cols-[2rem_1fr_1fr] items-center text-sm">
              <span className="font-mono text-[11px] text-muted">{i + 1}.</span>
              {[0, 1].map((c) => {
                const idx = i * 2 + c;
                const p = plies[idx];
                return p ? (
                  <button key={c} type="button" onClick={() => jump(idx + 1)} aria-current={ply === idx + 1 ? "true" : undefined}
                    className="rounded px-2 py-1 text-left font-mono text-[13px] text-muted transition-colors duration-150 hover:text-fg aria-[current=true]:bg-accent/15 aria-[current=true]:text-fg">{p.san}</button>
                ) : <span key={c} />;
              })}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
