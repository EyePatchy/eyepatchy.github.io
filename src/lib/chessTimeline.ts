import { Chess } from "chess.js";

export type PieceType = "p" | "n" | "b" | "r" | "q" | "k";
export type PieceState = { id: string; type: PieceType; color: "w" | "b"; sq: string };
export type Ply = { san: string; from: string; to: string; color: "w" | "b"; number: number };

export function buildTimeline(pgn: string) {
  const game = new Chess();
  game.loadPgn(pgn);
  const cur = new Map<string, PieceState>();
  new Chess().board().forEach((row, r) => row.forEach((p, f) => {
    if (!p) return;
    const sq = "abcdefgh"[f] + (8 - r);
    cur.set(sq, { id: `${p.color}${p.type}${sq}`, type: p.type, color: p.color, sq });
  }));
  const frames: PieceState[][] = [[...cur.values()]];
  const plies: Ply[] = [];
  game.history({ verbose: true }).forEach((m, i) => {
    const mover = cur.get(m.from)!;
    cur.delete(m.from);
    if (m.captured) cur.delete(m.flags.includes("e") ? m.to[0] + m.from[1] : m.to);
    cur.set(m.to, { ...mover, sq: m.to, type: (m.promotion ?? mover.type) as PieceType });
    if (m.flags.includes("k") || m.flags.includes("q")) {
      const rank = m.from[1];
      const [rf, rt] = m.flags.includes("k") ? ["h", "f"] : ["a", "d"];
      const rook = cur.get(rf + rank)!;
      cur.delete(rf + rank);
      cur.set(rt + rank, { ...rook, sq: rt + rank });
    }
    frames.push([...cur.values()]);
    plies.push({ san: m.san, from: m.from, to: m.to, color: m.color, number: Math.floor(i / 2) + 1 });
  });
  return { frames, plies };
}
