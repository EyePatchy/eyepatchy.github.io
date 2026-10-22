import { Github, MessageCircle, Music2, Gamepad2, Box, type LucideIcon } from "lucide-react";

export const asset = (p: string) => `${import.meta.env.BASE_URL}${p}`;

export const sections = [
  { id: "work", index: "01", label: "Work", title: "Selected work." },
  { id: "skills", index: "02", label: "Skills", title: "A map of what I build with." },
  { id: "setup", index: "03", label: "Setup", title: "The machine, and what plugs into it." },
  { id: "guitar", index: "04", label: "Guitar", title: "Signal path." },
  { id: "games", index: "05", label: "Games", title: "Hours, modes and Pantheons." },
  { id: "chess", index: "06", label: "Chess", title: "The Game of the Century." },
  { id: "connect", index: "07", label: "Connect", title: "Let’s talk." },
] as const;

export const hero = {
  lead: ["JavaScript developer", "and graphic designer"],
  sub: "Outside of coding, I spend most of my time gaming. I also enjoy chess and electric guitar, even if I don't play either as much these days.",
  note: "Built with React, TypeScript, Tailwind and Motion.",
};

export const showcase = {
  title: "YouTube thumbnails",
  blurb: "Thumbnails I designed for YouTube videos. Open any one to browse them full size.",
  format: "16:9",
};

export const site = {
  name: "Arta",
  alias: "EyePatchy",
  discordId: "578637878779838486",
  discordUrl: "https://discord.com/users/578637878779838486",
  avatar: "media/profile.jpg",
  links: [
    { label: "Discord", href: "https://discord.com/users/578637878779838486", icon: MessageCircle },
    { label: "GitHub", href: "https://github.com/eyepatchy", icon: Github },
    { label: "Spotify", href: "https://open.spotify.com/user/31pk24zwuhe2flq5ca7ogrgqbbn4", icon: Music2 },
    { label: "Steam", href: "https://steamcommunity.com/id/eyepatche/", icon: Gamepad2 },
    { label: "NameMC", href: "https://namemc.com/profile/EyePatchy.2", icon: Box },
  ] satisfies { label: string; href: string; icon: LucideIcon }[],
};
