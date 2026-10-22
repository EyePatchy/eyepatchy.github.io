import type { Transition } from "motion/react";

export const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];
export const dur = { micro: 0.18, ui: 0.35, section: 0.8 } as const;
export const spring: Transition = { type: "spring", stiffness: 380, damping: 32, mass: 0.7 };
