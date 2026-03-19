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
    name: "HackerRank",
    logo: "/assets/sponsors/hackerrank.png",
    label: "Coding Partner",
    category: "gold",
    url: "https://hackerrank.com",
  },
  {
    name: "Gofr",
    logo: "/assets/sponsors/gofr.png",
    label: "Powered by",
    category: "gold",
    url: "https://gofr.dev",
  },
  {
    name: "Hello Recruiter",
    logo: "/assets/sponsors/hello-recruiter.png",
    label: "Hiring Partner",
    category: "gold",
    url: "https://hellorecruiter.ai/",
  },

  /* Silver — 2 per row */
  {
    name: "Devfolio",
    logo: "/assets/sponsors/devfolio_white.png",
    label: "Platform Partner",
    category: "silver",
    url: "https://devfolio.co",
  },
  {
    name: "V0 by Vercel",
    logo: "/assets/sponsors/v0.png",
    label: "Co-Powered by",
    category: "silver",
    url: "https://v0.app",
  },
  {
    name: "NxtWave Launchpad",
    logo: "/assets/sponsors/nextwave.png",
    label: "Career Partner",
    category: "silver",
    url: "https://launchpad.nxtwave.tech/",
  },

  /* Bronze — 3 per row */
  {
    name: "Interview Buddy",
    logo: "/assets/sponsors/interview_buddy.png",
    label: "Hiring Partner",
    category: "bronze",
    url: "https://interviewbuddy.net",
  },
  {
    name: "Osen",
    logo: "/assets/sponsors/osen.png",
    label: "Event Partner",
    category: "bronze",
    url: "https://www.linkedin.com/company/osenofficial/",
  },
  {
    name: "Coming Soon",
    logo: "/assets/branding/hackmol_logo.png",
    label: "Coming Soon",
    category: "bronze",
    url: "#",
  },

  /* Community — 3 per row */
  {
    name: "GDGC NIT Jalandhar",
    logo: "/assets/sponsors/gdgc-nitj.png",
    label: "Community Partner",
    category: "community",
    url: "https://gdg.community.dev/gdg-on-campus-dr-b-r-ambedkar-national-institute-of-technology-jalandhar-india/",
  },
  {
    name: "Creative Computing Society",
    logo: "/assets/sponsors/ccstiet.png",
    label: "Community Partner",
    category: "community",
    url: "https://ccstiet.com",
  },
  {
    name: "Spec NITH",
    logo: "/assets/sponsors/spec_nith.png",
    label: "Community Partner",
    category: "community",
    url: "https://spec-nith.github.io",
  },
  {
    name: "The Uniques Community",
    logo: "/assets/sponsors/theuniques.png",
    label: "Community Partner",
    category: "community",
    url: "https://www.theuniques.in",
  },
  {
    name: "Tech Titans, GNDU Amritsar",
    logo: "/assets/sponsors/tech-titans.png",
    label: "Community Partner",
    category: "community",
    url: "https://www.instagram.com/techtitans.cess/",
  },
  {
    name: "GDG Jalandhar",
    logo: "/assets/sponsors/gdg-jalandhar.png",
    label: "Community Partner",
    category: "community",
    url: "https://gdg.community.dev/gdg-jalandhar/",
  },
  {
    name: "GDGoC SR Group of Institutions, Jhansi",
    logo: "/assets/sponsors/gdg-jhansi.png",
    label: "Community Partner",
    category: "community",
    url: "https://gdg.community.dev/gdg-on-campus-sr-group-of-institutions-jhansi-india/",
  },
  {
    name: "GDGoC PUSSGRC",
    logo: "/assets/sponsors/gdg-pussgrc.png",
    label: "Community Partner",
    category: "community",
    url: "https://gdg.community.dev/gdg-on-campus-panjab-university-swami-sarvanand-giri-regional-centre-hoshiarpur-india/",
  },
];

/** Column count per sponsor tier for the grid layout */
export const tierColumns: Record<SponsorCategory, number> = {
  gold: 1,
  silver: 2,
  bronze: 3,
  community: 3,
};
