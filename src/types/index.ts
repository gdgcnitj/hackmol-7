/**
 * Centralized type definitions for HackMol 7.0
 *
 * All domain types live here so components and data files share a single
 * source of truth. Organised by section for easy navigation.
 */

/* ═══════════════════════════════════════════════════════════════════════════
   SITE-WIDE / COMMON
   ═══════════════════════════════════════════════════════════════════════════ */

/** Re-usable link shape used across navbar, footer, etc. */
export interface SiteLink {
  label: string;
  href: string;
}

/** Social / community link with an icon identifier */
export interface SocialLink extends SiteLink {
  icon: string; // icon identifier (e.g. "github", "instagram")
}

/** Top-level site configuration (URLs, dates, metadata) */
export interface SiteConfig {
  name: string;
  tagline: string;
  url: string;
  devfolioSlug: string;
  devfolioUrl: string;
  organiser: string;
  venue: {
    name: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    mapUrl: string;
    mapEmbedSrc: string;
  };
  dates: {
    hackathonStart: string;   // ISO 8601
    hackathonEnd: string;
    registrationOpen: string;
    registrationClose: string;
  };
  analytics: {
    googleTagId: string;
    googleSiteVerification: string;
  };
}

/* ═══════════════════════════════════════════════════════════════════════════
   HERO SECTION
   ═══════════════════════════════════════════════════════════════════════════ */

export interface HeroConfig {
  frameCount: number;
  minFramesForScroll: number;
  concurrentLoadLimit: number;
  countdownTarget: string; // ISO 8601 date to count down to
  ctaLabel: string;
}

/* ═══════════════════════════════════════════════════════════════════════════
   ABOUT SECTION
   ═══════════════════════════════════════════════════════════════════════════ */

export type StatCardVariant = "card-1" | "card-2" | "card-3" | "card-4";

export interface StatItem {
  end: number;
  suffix: string;
  label: string;
  card: StatCardVariant;
}

export interface AboutContent {
  subtitle: string;
  subtitleHighlight: string;
  description: string;
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  heading: {
    title: string;
    highlight: string;
    highlightPosition: "before" | "after";
    description: string;
  };
}

/* ═══════════════════════════════════════════════════════════════════════════
   TIMELINE SECTION
   ═══════════════════════════════════════════════════════════════════════════ */

export interface TimelineEvent {
  title: string;
  description: string;
  date: string;
}

/* ═══════════════════════════════════════════════════════════════════════════
   TRACKS SECTION
   ═══════════════════════════════════════════════════════════════════════════ */

export type TrackVariant = "side" | "center";

export interface TrackData {
  name: string;
  image: string;
  variant: TrackVariant;
  description: string;
}

export interface InnovationArea {
  name: string;
  iconName: string; // icon identifier resolved in the component
}

export interface SpecialTrackReward {
  title: string;
  description: string;
  iconName: string;
  amount?: string;
  url?: string;
}

export interface SpecialTrackData {
  name: string;
  badge: string;
  organizerName: string;
  organizerUrl: string;
  description: string;
  rewards: SpecialTrackReward[];
}

/* ═══════════════════════════════════════════════════════════════════════════
   SPONSORS SECTION
   ═══════════════════════════════════════════════════════════════════════════ */

export type SponsorCategory = "gold" | "silver" | "bronze" | "community";

export interface Sponsor {
  name: string;
  logo: string;
  label: string;
  category: SponsorCategory;
  url?: string;
}

export interface SponsorTier {
  key: SponsorCategory;
  title: string;
}

/* ═══════════════════════════════════════════════════════════════════════════
   PRIZES SECTION
   ═══════════════════════════════════════════════════════════════════════════ */

export interface TopPrize {
  title: string;
  subtitle: string;
  amount: string;
  iconPath: string; // path to static import
  highlight?: boolean;
  rank: string;
  description: string;
}

export interface SpecialPrize {
  title: string;
  subtitle: string;
  amount: string;
  category: string;
  description: string;
}

/* ═══════════════════════════════════════════════════════════════════════════
   SPEAKERS / JUDGES / MENTORS SECTION
   ═══════════════════════════════════════════════════════════════════════════ */

export interface PersonData {
  name: string;
  designation: string;
  category: "JUDGE" | "MENTOR";
  image: string; // path (resolved to StaticImageData at component level)
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  portfolio?: string;
}

/* ═══════════════════════════════════════════════════════════════════════════
   FAQ SECTION
   ═══════════════════════════════════════════════════════════════════════════ */

export interface FAQItem {
  question: string;
  answer: string;
}

export type FAQCategoryKey = "ABOUT" | "REGISTER" | "LOGISTICS";

export type FAQCategoryData = Record<FAQCategoryKey, FAQItem[]>;

/* ═══════════════════════════════════════════════════════════════════════════
   CONTACT SECTION
   ═══════════════════════════════════════════════════════════════════════════ */

export interface ContactPerson {
  name: string;
  image: string;
  linkedin: string;
}

/* ═══════════════════════════════════════════════════════════════════════════
   NAVIGATION / FOOTER
   ═══════════════════════════════════════════════════════════════════════════ */

export interface NavLink {
  label: string;
  href: string;
}

export type FooterResourceLink = SiteLink;

export type FooterArchiveLink = SiteLink;

export type FooterCommunityLink = SocialLink;

export type FooterSocialLink = SocialLink;

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION HEADING (UI)
   ═══════════════════════════════════════════════════════════════════════════ */

export interface SectionHeadingProps {
  title: string;
  highlight?: string;
  highlightPosition?: "before" | "after";
  description?: string;
  className?: string;
}
