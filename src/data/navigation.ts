import type {
  NavLink,
  FooterResourceLink,
  FooterArchiveLink,
  FooterCommunityLink,
  FooterSocialLink,
} from "@/types";

/* ─── Navbar ─── */

export const navLinks: NavLink[] = [
  { label: "About",    href: "#about" },
  { label: "Timeline", href: "#timeline" },
  { label: "Tracks",   href: "#tracks" },
  { label: "Sponsors", href: "#sponsors" },
  { label: "Prizes",   href: "#prizes" },
  { label: "Judges",   href: "#judges" },
  { label: "Team",     href: "#team" },
  { label: "FAQ",      href: "#faq" },
  { label: "Resources", href: "/resources" },
];

/* ─── Footer ─── */

export const resourceLinks: FooterResourceLink[] = [
  {
    label: "Sponsorship Brochure",
    href: "https://drive.google.com/file/d/1xxk_nWFjG_9N0euqXvt3tSQumzSP-Qqt/view?usp=sharing",
  },
  { label: "Code of Conduct", href: "https://devfolio.co/code-of-conduct" },
  { label: "DevFolio", href: "https://hackmol-7.devfolio.co" },
];

export const archiveLinks: FooterArchiveLink[] = [
  { label: "HackMol 6.0", href: "https://v6.hackmol.com" },
  { label: "HackMol 5.0", href: "https://v5.hackmol.com" },
  { label: "HackMol 4.0", href: "https://v4.hackmol.com" },
  { label: "HackMol 3.0", href: "https://v3.hackmol.com" },
  { label: "HackMol 2.0", href: "https://hackmol.devfolio.co" },
];

export const communityLinks: FooterCommunityLink[] = [
  {
    label: "GitHub",
    href: "https://github.com/gdgcnitj",
    icon: "FaGithub",
  },
  {
    label: "WhatsApp Support 1.0",
    href: "https://chat.whatsapp.com/Dxe6XJ8dXKnKPN5ClLB0KU?mode=gi_t",
    icon: "FaWhatsapp",
  },
  {
    label: "WhatsApp Support 2.0",
    href: "https://chat.whatsapp.com/BVBuQzESMxOL2onVXjRurR?mode=gi_t",
    icon: "FaWhatsapp",
  },
  {
    label: "Find Teammate",
    href: "https://chat.whatsapp.com/DoH0Rp1Yz7oCG8XmUvdVR2?mode=gi_t",
    icon: "FaWhatsapp",
  },
];

export const socialLinks: FooterSocialLink[] = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/gdgcnitj",
    icon: "FaInstagram",
  },
  {
    label: "Twitter",
    href: "https://x.com/GDSCNitj",
    icon: "FaXTwitter",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/dscnitj",
    icon: "FaLinkedinIn",
  },
];
