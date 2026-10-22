import { useSyncExternalStore } from "react";

export type Theme = "dark" | "light";
export type Prefs = { theme: Theme; rain: boolean };
const KEY = "prefs-v1";
const media = (q: string) => typeof matchMedia === "function" && matchMedia(q).matches;

function read(): Prefs {
  let saved: Partial<Prefs> = {};
  try { saved = JSON.parse(localStorage.getItem(KEY) ?? "{}") ?? {}; } catch { /* storage unavailable */ }
  return {
    theme: saved.theme === "light" || saved.theme === "dark" ? saved.theme : media("(prefers-color-scheme: light)") ? "light" : "dark",
    rain: typeof saved.rain === "boolean" ? saved.rain : !media("(prefers-reduced-motion: reduce)"),
  };
}

let state = read();
const subs = new Set<() => void>();
const apply = () => {
  const root = document.documentElement;
  root.dataset.theme = state.theme;
  root.style.colorScheme = state.theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", state.theme === "light" ? "#eceff3" : "#08090a");
};
apply();

export const prefs = {
  get: () => state,
  subscribe: (fn: () => void) => { subs.add(fn); return () => { subs.delete(fn); }; },
  set(next: Partial<Prefs>) {
    const themeChanged = next.theme !== undefined && next.theme !== state.theme;
    state = { ...state, ...next };
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* ignore */ }
    if (themeChanged && !media("(prefers-reduced-motion: reduce)")) { // short colour crossfade, only while switching
      const el = document.documentElement;
      el.classList.add("theme-fade");
      setTimeout(() => el.classList.remove("theme-fade"), 450);
    }
    apply();
    subs.forEach((f) => f());
  },
};
export const usePrefs = () => useSyncExternalStore(prefs.subscribe, prefs.get);
