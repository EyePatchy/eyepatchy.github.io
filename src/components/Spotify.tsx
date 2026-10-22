import { useEffect, useRef, useState } from "react";
import { track } from "../data/music";

export function SpotifyPlayer() {
  const frame = useRef<HTMLIFrameElement>(null);
  const [show, setShow] = useState(false);
  const [engaged, setEngaged] = useState(false);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShow(true), 500); return () => clearTimeout(t); }, []);
  useEffect(() => {
    const onBlur = () => { if (document.activeElement === frame.current) setEngaged(true); };
    window.addEventListener("blur", onBlur);
    return () => window.removeEventListener("blur", onBlur);
  }, []);
  const configured = !!track.id && !track.id.startsWith("REPLACE");
  return (
    <div className="w-full max-w-sm">
      <p className="mb-2 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
        <span className={`size-1.5 rounded-full bg-accent ${engaged ? "" : "soft-pulse"}`} />
        {engaged ? `${track.title} · ${track.artist}` : "Press play to listen"}
        {configured && <a href={`https://open.spotify.com/track/${track.id}`} target="_blank" rel="noreferrer" className="link-u ml-auto normal-case tracking-normal hover:text-fg">Open in Spotify</a>}
      </p>
      <div className="relative h-20 overflow-hidden rounded-xl border border-line bg-surface">
        <p className="absolute inset-0 grid place-items-center px-4 text-center font-mono text-[11px] text-muted">{configured ? "Loading player…" : "Set the Spotify track ID in src/data/music.ts"}</p>
        {configured && show && (
          <iframe ref={frame} title={`${track.title} by ${track.artist} on Spotify`} width="100%" height="80" loading="lazy" onLoad={() => setLoaded(true)}
            style={{ colorScheme: "normal" }} className={`relative block border-0 transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
            src={`https://open.spotify.com/embed/track/${track.id}?utm_source=generator&theme=0`}
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" />
        )}
      </div>
    </div>
  );
}
