import type { StatItem, AboutContent } from "@/types";

export const stats: StatItem[] = [
  { end: 17437, suffix: "+", label: "Participants",       card: "card-1" },
  { end: 413,   suffix: "+", label: "Projects Submitted", card: "card-2" },
  { end: 100,   suffix: "+", label: "Sponsors",           card: "card-3" },
  { end: 30,    suffix: "+", label: "Hours of Hacking",   card: "card-4" },
];

export const aboutContent: AboutContent = {
  subtitle: "Code Like a God,",
  subtitleHighlight: "Leave a Legacy!",
  description:
    "The seventh edition of HackMol, organised by GDGC NIT Jalandhar, is your battleground for innovation. <span class=\"hidden md:inline\"> This 30-hour hackathon unites warriors of code, both seasoned champions and rising contenders to forge groundbreaking solutions across digital realms. March 28-29, 2026. Descend into the depths of innovation, discover new possibilities, and develop real-world solutions that leave a lasting impact.</span>",
  image: {
    src: "/assets/team/team.png",
    alt: "HackMol Team at NIT Jalandhar",
    width: 500,
    height: 350,
  },
  heading: {
    title: "ABOUT HACKMOL",
    highlight: "7.0",
    highlightPosition: "after",
    description:
      "Descend into 30 hours of creation. NIT Jalandhar\u2019s flagship hackathon, where builders forge the future.",
  },
};
