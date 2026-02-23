import Image from "next/image";
import { FaInstagram, FaLinkedinIn, FaGithub, FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import type { IconType } from "react-icons";
import {
  resourceLinks,
  archiveLinks,
  communityLinks as communityLinksData,
  socialLinks as socialLinksData,
} from "@/data/navigation";
import { siteConfig } from "@/data/site";
import "./footer.css";
import FooterMap from "./FooterMap";

/** Map icon identifiers from the data layer to actual icon components */
const iconMap: Record<string, IconType> = {
  FaGithub,
  FaWhatsapp,
  FaInstagram,
  FaXTwitter,
  FaLinkedinIn,
};

/** Resolve icon strings to components for rendering */
const communityLinks = communityLinksData.map((link) => ({
  ...link,
  Icon: iconMap[link.icon] ?? FaGithub,
}));

const socialLinks = socialLinksData.map((link) => ({
  ...link,
  Icon: iconMap[link.icon] ?? FaInstagram,
}));

export default function Footer() {
  return (
    <footer className="footer-section">
      <div className="footer-dark-top" />

      <div className="footer-bg footer-bg--wide">
        <Image
          src="/images/footerBGWide.png"
          alt=""
          fill
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "center bottom" }}
        />
      </div>

      <div className="footer-bg footer-bg--narrow">
        <Image
          src="/images/footerBGNarrow.png"
          alt=""
          fill
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "center bottom" }}
        />
      </div>

      <div className="footer-content">

        {/* ── Col 1: Brand + Venue ── */}
        <div className="footer-col-1">
          <div className="footer-brand">
            <Image
              src="/images/hackmol_logo.png"
              alt="HackMol 7.0"
              width={184}
              height={184}
              className="footer-logo"
            />
            <p className="footer-brand-org">Organised by: {siteConfig.organiser}</p>
          </div>

          <div className="footer-venue">
            <h3 className="footer-col-heading">Venue</h3>
            <FooterMap />
            <p className="footer-venue-date">March 28 – 29, 2026</p>
            <p className="footer-venue-place">NIT Jalandhar, Punjab</p>
          </div>
        </div>

        {/* ── Col 2: Resources + Archives ── */}
        <div className="footer-resources-archives">
          <div className="footer-col-group">
            <h3 className="footer-col-heading">Resources</h3>
            <ul className="footer-col-list">
              {resourceLinks.map((link, i) => (
                <li key={i}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer">{link.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer-col-group">
            <h3 className="footer-col-heading">Archives</h3>
            <ul className="footer-col-list">
              {archiveLinks.map((link, i) => (
                <li key={i}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer">{link.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Col 3: Community + Social ── */}
        <div className="footer-col-3">
          <div className="footer-community">
            <h3 className="footer-col-heading">Community</h3>
            <ul className="footer-col-list">
              {communityLinks.map(({ label, href, Icon }, i) => (
                <li key={i}>
                  <a href={href} target="_blank" rel="noopener noreferrer" className="footer-community-link">
                    <Icon className="footer-community-icon" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-social">
            <h3 className="footer-col-heading">Social</h3>
            <div className="footer-social-icons">
              {socialLinks.map(({ label, href, Icon }, i) => (
                <a
                  key={i}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon className="footer-social-icon" />
                </a>
              ))}
            </div>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} GDG on Campus, NIT Jalandhar. All rights reserved.</p>
      </div>
    </footer>
  );
}
