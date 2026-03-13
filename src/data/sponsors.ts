import type { Sponsor, SponsorTier, SponsorCategory } from "@/types";

export const sponsorTiers: SponsorTier[] = [
  { key: "gold",      title: "Gold Sponsors" },
  { key: "silver",    title: "Silver Sponsors" },
  { key: "bronze",    title: "Bronze Sponsors" },
  { key: "community", title: "Community Partners" },
];

export const sponsors: Sponsor[] = [
  /* Gold — 1 per row */
  {
    name: "Gofr",
    logo: "/assets/sponsors/gofr_logo.svg",
    label: "Title Sponsor",
    category: "gold",
  },
  {
    name: "V0 by Vercel",
    logo: "/assets/sponsors/v0.png",
    label: "Co-Powered by",
    category: "gold",
  },

  /* Silver — 2 per row */
  {
    name: "Devfolio",
    logo: "/assets/sponsors/devfolio_white.png",
    label: "Platform Partner",
    category: "silver",
  },

  /* Bronze — 3 per row */
  {
    name: "Interview Buddy",
    logo: "/assets/sponsors/interview_buddy.svg",
    label: "Hiring Partner",
    category: "bronze",
  },
  {
    name: "Osen",
    logo: "/assets/sponsors/osen.png",
    label: "Event Partner",
    category: "bronze",
  },

  /* Community — 3 per row */
  {
    name: "GDGC NIT Jalandhar",
    logo: "/assets/sponsors/gdgc-nitj.png",
    label: "Community Partner",
    category: "community",
  },
  {
    name: "Creative Computing Society",
    logo: "/assets/sponsors/ccstiet.png",
    label: "Community Partner",
    category: "community",
  },
  {
    name: "Spec NITH",
    logo: "/assets/sponsors/spec_nith.png",
    label: "Community Partner",
    category: "community",
  },
  {
    name: "The Uniques Community",
    logo: "/assets/sponsors/theuniques.png",
    label: "Community Partner",
    category: "community",
  },
];

/** Column count per sponsor tier for the grid layout */
export const tierColumns: Record<SponsorCategory, number> = {
  gold: 1,
  silver: 2,
  bronze: 3,
  community: 3,
};
