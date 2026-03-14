import type { TopPrize, SpecialPrize } from "@/types";

export const topPrizes: TopPrize[] = [
  {
    title: "The Shadow Relic",
    subtitle: "₹30,000",
    amount: "₹30,000",
    iconPath: "/assets/prizes/bat-second.png",
    rank: "2nd",
    description:
      "For the team delivering a highly impressive and technically strong solution.",
  },
  {
    title: "The Abyss Crown",
    subtitle: "₹50,000",
    amount: "₹50,000",
    iconPath: "/assets/prizes/bat-first.png",
    highlight: true,
    rank: "1st",
    description:
      "Awarded to the team that demonstrates exceptional innovation, execution, and impact.",
  },
  {
    title: "The Crystal Honor",
    subtitle: "₹10,000",
    amount: "₹10,000",
    iconPath: "/assets/prizes/bat-third.png",
    rank: "3rd",
    description:
      "Recognizing a standout project with strong potential and creativity.",
  },
];

export const specialPrizes: SpecialPrize[] = [
  {
    title: "The Lantern of Beginnings",
    subtitle: "₹10,000",
    amount: "₹10,000",
    category: "Fresher's Track",
    description:
      "Celebrating the most promising and well-executed project by fresh innovators.",
  },
  {
    title: "The Queen's Emblem",
    subtitle: "₹10,000",
    amount: "₹10,000",
    category: "Women Track",
    description:
      "Awarded to the most outstanding women-led innovation of HackMOL 7.0.",
  },
  {
    title: "HackerRank Coding Challenge",
    subtitle: "$500K",
    amount: "$300 / winner",
    category: "HackerRank Coding Track",
    description:
      "Top 3 coders win 1-year HackerRank Infinity Plan ($300/person), 6-month JoinSecret access (1500+ tools worth up to $500K in credits), mock interview credits, and exclusive HackerRank merchandise.",
  },
];
