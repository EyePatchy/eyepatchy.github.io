import { AnimatePresence, motion } from "motion/react";
import { ease } from "../motion";
import type { PieceState, PieceType } from "../lib/chessTimeline";

const dot = (x: number, y: number, r: number) => `M${x - r} ${y}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`;
const BASE = "M22 92H78V84Q78 80 74 80H26Q22 80 22 84Z";
const SHAPES: Record<PieceType, string[]> = {
  p: [dot(50, 34, 11), "M38 46H62L58 52L65 80H35L42 52Z"],
  r: ["M30 22H40V30H45V22H55V30H60V22H70V42L64 48V72L70 80H30L36 72V48L30 42Z"],
  n: ["M38 80C38 66 44 62 46 56C40 56 34 54 30 50L28 44L40 32L42 22L48 26C52 22 58 22 62 26C70 34 72 60 68 80Z"],
  b: [dot(50, 19, 5), "M50 24C61 32 65 42 60 50L56 53H63L58 59V72L66 80H34L42 72V59L37 53H44L40 50C35 42 39 32 50 24Z"],
  q: ["M28 34L33.5 56L39 30L44.5 56L50 26L55.5 56L61 30L66.5 56L72 34L68 70L74 80H26L32 70Z", ...[28, 39, 50, 61, 72].map((x, i) => dot(x, [31, 27, 23, 27, 31][i], 3.2))],
  k: ["M47 12H53V18H59V24H53V30H47V24H41V18H47Z", "M36 36Q50 30 64 36L62 52Q60 56 62 60L66 72L72 80H28L34 72L38 60Q40 56 38 52Z"],
};

function Figure({ type, color }: { type: PieceType; color: "w" | "b" }) {
  const shapes = [...SHAPES[type], BASE];
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMax meet" className="size-full overflow-visible" aria-hidden>
      <g fill="none" strokeWidth={5} strokeLinejoin="round" style={{ stroke: `var(--p-${color}-edge)` }}>{shapes.map((d, i) => <path key={i} d={d} />)}</g>
      <g style={{ fill: `var(--p-${color})` }}>{shapes.map((d, i) => <path key={i} d={d} />)}</g>
    </svg>
  );
}

const pos = (sq: string) => ({ f: sq.charCodeAt(0) - 97, r: 8 - Number(sq[1]) });
type Props = { pieces: PieceState[]; move?: { from: string; to: string }; moveMs: number; lift: boolean };

export function ChessBoard({ pieces, move, moveMs, lift }: Props) {
  return (
    <div className="chess-stage absolute inset-0 grid place-items-center">
      <div className="chess-board relative w-[88%] rounded-[3px] p-[2.2%]" style={{ background: "var(--board-edge)" }}>
        <div className="relative aspect-square [transform-style:preserve-3d]">
          <div className="absolute inset-0 grid grid-cols-8 grid-rows-8">
            {Array.from({ length: 64 }, (_, i) => <div key={i} style={{ background: (Math.floor(i / 8) + (i % 8)) % 2 ? "var(--sq-dark)" : "var(--sq-light)" }} />)}
          </div>
          {move && [move.from, move.to].map((sq) => {
            const { f, r } = pos(sq);
            return <motion.div key={`${move.from}${move.to}${sq}`} className="absolute size-[12.5%]" style={{ left: `${f * 12.5}%`, top: `${r * 12.5}%`, background: "var(--board-hi)" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, ease }} />;
          })}
          <AnimatePresence>
            {pieces.map((p) => {
              const { f, r } = pos(p.sq);
              const moving = lift && move?.to === p.sq;
              return (
                <motion.div key={p.id} className="absolute left-0 top-0 size-[12.5%] [transform-style:preserve-3d]" initial={false} animate={{ x: `${f * 100}%`, y: `${r * 100}%` }} transition={{ duration: moveMs, ease }}>
                  <i aria-hidden className="absolute left-[14%] top-[42%] h-[34%] w-[72%] rounded-full" style={{ background: "radial-gradient(closest-side, var(--shadow-ink), transparent)" }} />
                  <div className="chess-stand absolute bottom-[46%] left-[-12%] h-[132%] w-[124%]">
                    <motion.div className="size-full" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1, y: moving ? ["0%", "-10%", "0%"] : "0%" }}
                      transition={{ default: { duration: 0.4, ease }, y: { duration: moveMs, ease, times: [0, 0.5, 1] } }}
                      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.35, delay: moveMs * 0.6 } }}>
                      <Figure type={p.type} color={p.color} />
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
