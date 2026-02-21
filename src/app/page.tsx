import About from "@/components/landing/about";
import Hero from "../components/landing/hero";
import Timeline from "@/components/landing/timeline";
import Tracks from "@/components/landing/tracks";
import Sponsors from "@/components/landing/sponsors";
import Prizes from "@/components/landing/prizes";
import Speakers from "@/components/landing/speakers";
import FAQ from "@/components/landing/FAQ";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />w
      <About />
      <Timeline />
      <Tracks />
      <Sponsors />
      <Prizes />
      <Speakers />
      <FAQ />
    </div>
  );
}
