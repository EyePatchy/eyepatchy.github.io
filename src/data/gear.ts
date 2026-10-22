import { Headphones, Keyboard, Mouse, type LucideIcon } from "lucide-react";

type Item = { k: string; v: string; state?: "active" | "disabled" };
export const laptop: { name: string; groups: { label: string; items: Item[]; note?: string }[] } = {
  name: "Lenovo ThinkPad E590",
  groups: [
    { label: "Processor & memory", items: [{ k: "CPU", v: "Intel Core i5-8265U" }, { k: "RAM", v: "8 GB DDR4" }] },
    { label: "Storage", items: [{ k: "SSD", v: "1 TB" }] },
    { label: "Graphics", items: [{ k: "Integrated", v: "Intel UHD Graphics 620", state: "active" }, { k: "Discrete", v: "AMD Radeon RX 550X", state: "disabled" }],
      note: "The RX 550X stays disabled because of long-standing stability and gaming-performance problems." },
  ],
};

export const peripherals: { kind: string; name: string; role: string; icon: LucideIcon }[] = [
  { kind: "Mouse", name: "Cooler Master MM710", role: "Input · pointing", icon: Mouse },
  { kind: "Keyboard", name: "Redragon Fizz K17-RGB", role: "Input · typing", icon: Keyboard },
  { kind: "Headphones", name: "Razer BlackShark V2 X", role: "Output · audio", icon: Headphones },
];

type Field = [string, string | null];
export const rig: Record<"guitar" | "amp", { label: string; title: string; fields: Field[] }> = {
  guitar: { label: "Guitar", title: "Jackson electric guitar", fields: [["Brand", "Jackson"], ["Model", "01030233"], ["Pickups", "Black open-coil humbuckers"], ["Hardware", "Chrome hardware, Tune-o-matic-style fixed bridge with a stopbar tailpiece, and a 3+3 tuner layout"]] },
  amp: { label: "Amplifier", title: "Amplifier", fields: [["Brand", "Marshall"], ["Model", "MG10G"]] },
};
