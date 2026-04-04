import About from "@/components/landing/about";
import Hero from "../components/landing/hero";
import Timeline from "@/components/landing/timeline";
import Tracks from "@/components/landing/tracks";
import Sponsors from "@/components/landing/sponsors";
import Prizes from "@/components/landing/prizes";
import Speakers from "@/components/landing/speakers";
import Team from "@/components/landing/team";
import FAQ from "@/components/landing/FAQ";
import HomeSectionScroller from "@/components/layout/HomeSectionScroller";

export default function Home() {
  return (
    <div className="flex flex-col">
      <HomeSectionScroller />
      <Hero />
      <About />
      <Timeline />
      <Tracks />
      <Sponsors />
      <Prizes />
      <Speakers />
      <Team />
      <FAQ />
    </div>
  );
}
