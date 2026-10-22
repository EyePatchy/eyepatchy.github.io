import { lazy, Suspense } from "react";
import { SectionHead } from "./Reveal";

const ChessReplay = lazy(() => import("./Chess"));

export function ChessSection() {
  return (
    <section id="chess" className="mx-auto max-w-6xl px-6 py-28 md:py-40">
      <SectionHead id="chess" />
      <Suspense fallback={<div className="min-h-[34rem]" aria-hidden />}><ChessReplay /></Suspense>
    </section>
  );
}
