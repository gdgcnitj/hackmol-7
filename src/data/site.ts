import type { SiteConfig } from "@/types";

/**
 * Global site configuration — single source of truth for URLs, dates,
 * venue information, and analytics IDs used throughout the project.
 */
export const siteConfig: SiteConfig = {
  name: "HackMol 7.0",
  tagline: "Descend. Discover. Develop.",
  url: "https://hackmol.com",
  devfolioSlug: "hackmol-7",
  devfolioUrl: "https://hackmol-7.devfolio.co",
  organiser: "GDGC NIT Jalandhar",

  venue: {
    name: "Dr B R Ambedkar National Institute of Technology Jalandhar",
    address: "G.T Road, Byepass",
    city: "Jalandhar",
    state: "Punjab",
    postalCode: "144008",
    country: "IN",
    mapUrl:
      "https://www.google.com/maps/place/Dr+B+R+Ambedkar+National+Institute+of+Technology+Jalandhar/@31.3958746,75.5332690,17z",
    mapEmbedSrc:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3405.662273018692!2d75.53326897662893!3d31.39587457427134!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391a51d30c180edf%3A0x5b7633718d17ef33!2sDr%20B%20R%20Ambedkar%20National%20Institute%20of%20Technology%20Jalandhar!5e0!3m2!1sen!2sin!4v1771692624813!5m2!1sen!2sin",
  },

  dates: {
    hackathonStart: "2026-03-28T08:00:00+05:30",
    hackathonEnd: "2026-03-29T14:00:00+05:30",
    registrationOpen: "2026-02-24T00:00:00+05:30",
    registrationClose: "2026-03-24T23:59:59+05:30",
  },

  analytics: {
    googleTagId: "G-Z5ZGV0B6C4",
    googleSiteVerification: "dxUBhkPvidgnshXZ9hg7wPgh4sMPCgaORzOFmAmsLVY",
  },
};
