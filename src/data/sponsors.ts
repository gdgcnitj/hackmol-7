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
    label: "Technology Partner",
    category: "gold",
  },

  /* Silver — 2 per row */
  {
    name: "Devfolio",
    logo: "/assets/sponsors/devfolio_white.png",
    label: "Platform Partner",
    category: "silver",
  },
  {
    name: "Coming Soon",
    logo: "",
    label: "Media Partner",
    category: "silver",
  },

  /* Bronze — 3 per row */
  {
    name: "Interview Buddy",
    logo: "/assets/sponsors/interview_buddy.svg",
    label: "Associate Partner",
    category: "bronze",
  },
  {
    name: "Coming Soon",
    logo: "",
    label: "Design Partner",
    category: "bronze",
  },
  {
    name: "Coming Soon",
    logo: "",
    label: "Beverage Partner",
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
    name: "Community 3",
    logo: "",
    label: "Community Partner",
    category: "community",
  },
  {
    name: "Community 4",
    logo: "",
    label: "Community Partner",
    category: "community",
  },
  {
    name: "Community 5",
    logo: "",
    label: "Community Partner",
    category: "community",
  },
  {
    name: "Community 6",
    logo: "",
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
