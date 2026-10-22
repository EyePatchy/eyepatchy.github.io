# eyepatchy.github.io

My personal portfolio. I'm Arta (EyePatchy), a JavaScript developer and graphic designer. It's a single page with the things I want people to see.

## What's on it

- YouTube thumbnails I designed, with a viewer you can flip through using the arrow keys
- A skill map of the tools I used when building the portfolio
- My laptop and gear, plus my guitar and amp
- Gaming history: Minecraft 1.8.9 PvP, about 5,000 hours of CS:GO before CS2, and Hollow Knight Pantheons
- A replay of Byrne vs Fischer, 1956 (the "Game of the Century") on a 3D chess board
- Rain that follows your mouse, with an off switch
- Dark and light themes, and a Spotify player with "Idea 10" by Gibran Alcocer

Your theme and rain choice are remembered. Animations tone down if your system is set to reduced motion.

## Built with

- React and TypeScript
- Vite
- Tailwind CSS
- Motion for animation
- Lucide for icons
- chess.js to read the game and check every move

The rain is a plain canvas. The chess board is CSS 3D with SVG pieces, no WebGL. The Discord card reads from the Lanyard API, and Spotify is the official embed, so no audio is hosted here.

## Run it

```bash
npm install
npm run dev
npm run build
```
