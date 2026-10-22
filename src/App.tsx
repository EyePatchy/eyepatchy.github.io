import { Rain } from "./components/Rain";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { Work } from "./components/Work";
import { SkillTree } from "./components/SkillTree";
import { Hardware, Guitar } from "./components/Gear";
import { Games } from "./components/Games";
import { ChessSection } from "./components/ChessSection";
import { Connect } from "./components/Connect";

export default function App() {
  return (
    <>
      <Rain />
      <Nav />
      <main className="relative z-10">
        <Hero />
        <Work />
        <SkillTree />
        <Hardware />
        <Guitar />
        <Games />
        <ChessSection />
        <Connect />
      </main>
    </>
  );
}
