import { useEffect, useState } from "react";
import { asset, site } from "../content";

type Status = "online" | "idle" | "dnd" | "offline";
type Lanyard = {
  discord_status: Status;
  discord_user: { id: string; username: string; global_name?: string | null; avatar?: string | null };
  activities: { type: number; name: string; state?: string | null }[];
  spotify?: { song: string; artist: string } | null;
};
const dot: Record<Status, string> = { online: "bg-emerald-400", idle: "bg-amber-400", dnd: "bg-rose-400", offline: "bg-zinc-500" };

export function DiscordCard() {
  const [d, setD] = useState<Lanyard | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const ac = new AbortController();
    const load = () =>
      fetch(`https://api.lanyard.rest/v1/users/${site.discordId}`, { signal: ac.signal })
        .then((r) => r.json())
        .then((j) => { if (j.success) { setD(j.data); setFailed(false); } else setFailed(true); })
        .catch((e) => { if (e.name !== "AbortError") setFailed(true); });
    load();
    const t = setInterval(load, 30_000);
    return () => { ac.abort(); clearInterval(t); };
  }, []);

  const u = d?.discord_user;
  const game = d?.activities.find((a) => a.type === 0);
  const custom = d?.activities.find((a) => a.type === 4)?.state;
  const line = d
    ? d.spotify ? `${d.spotify.song} — ${d.spotify.artist}` : game ? `Playing ${game.name}` : custom || "No activity right now"
    : failed ? "Open profile on Discord" : "Loading…";
  const avatar = u?.avatar ? `https://cdn.discordapp.com/avatars/${u.id}/${u.avatar}.png?size=128` : asset(site.avatar);

  return (
    <a href={site.discordUrl} target="_blank" rel="noreferrer"
      className="group block min-h-[132px] rounded-2xl border border-line bg-surface p-5 transition-[translate,border-color] duration-500 ease-fluid hover:-translate-y-1 hover:border-fg/25">
      <p className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-muted">Discord</p>
      <div className="flex items-center gap-4">
        <div className="relative shrink-0">
          <img src={avatar} alt="" width={56} height={56} loading="lazy" className="size-14 rounded-full object-cover" />
          <span className={`absolute -bottom-0.5 -right-0.5 size-3.5 rounded-full border-2 border-surface transition-colors duration-500 ${dot[d?.discord_status ?? "offline"]}`} />
        </div>
        <div className="min-w-0">
          <p className="truncate font-medium">{u ? u.global_name || u.username : site.alias}</p>
          <p className="truncate text-sm text-muted">{line}</p>
        </div>
      </div>
    </a>
  );
}
