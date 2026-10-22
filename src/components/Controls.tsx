import type { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CloudOff, CloudRain, Moon, Sun } from "lucide-react";
import { prefs, usePrefs } from "../lib/prefs";
import { ease } from "../motion";

const btn = "inline-flex h-9 items-center gap-2 rounded-full border border-line px-3 text-xs text-muted transition-colors duration-200 hover:border-fg/30 hover:text-fg";

function Swap({ k, children }: { k: string; children: ReactNode }) {
  return (
    <span className="relative grid size-4 place-items-center">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span key={k} initial={{ opacity: 0, scale: 0.6, rotate: -45 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} exit={{ opacity: 0, scale: 0.6, rotate: 45 }} transition={{ duration: 0.22, ease }} className="absolute">{children}</motion.span>
      </AnimatePresence>
    </span>
  );
}

export function Controls() {
  const { theme, rain } = usePrefs();
  const light = theme === "light";
  return (
    <div className="ml-2 flex items-center gap-2">
      <motion.button type="button" whileTap={{ scale: 0.95 }} aria-pressed={rain} aria-label="Rain" title={rain ? "Rain is on" : "Rain is off"} onClick={() => prefs.set({ rain: !rain })} className={btn}>
        <Swap k={rain ? "on" : "off"}>{rain ? <CloudRain size={16} /> : <CloudOff size={16} />}</Swap>
        <span className="hidden w-[4.4rem] whitespace-nowrap text-left font-mono uppercase tracking-wider sm:inline">{rain ? "Rain on" : "Rain off"}</span>
      </motion.button>
      <motion.button type="button" whileTap={{ scale: 0.95 }} aria-label={light ? "Switch to dark theme" : "Switch to light theme"} title={light ? "Light theme" : "Dark theme"} onClick={() => prefs.set({ theme: light ? "dark" : "light" })} className={`${btn} px-0 w-9 justify-center`}>
        <Swap k={theme}>{light ? <Sun size={16} /> : <Moon size={16} />}</Swap>
      </motion.button>
    </div>
  );
}
