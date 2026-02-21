import Image from "next/image";
import { FaInstagram, FaLinkedinIn, FaGithub, FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import type { IconType } from "react-icons";
import "./footer.css";
import FooterMap from "./FooterMap";

const resourceLinks = [
  { label: "Sponsorship Brochure", href: "https://drive.google.com/file/d/1xxk_nWFjG_9N0euqXvt3tSQumzSP-Qqt/view?usp=sharing" },
  { label: "Code of Conduct", href: "https://devfolio.co/code-of-conduct" },
  { label: "DevFolio", href: "https://hackmol-7.devfolio.co" },
];

const archiveLinks = [
  { label: "HackMol 6.0", href: "https://hackmol-6.devfolio.co" },
  { label: "HackMol 5.0", href: "https://hackmol-5.devfolio.co" },
  { label: "HackMol 4.0", href: "https://hackmol-4.devfolio.co" },
  { label: "HackMol 3.0", href: "https://hackmol3.devfolio.co" },
  { label: "HackMol 2.0", href: "https://hackmol.devfolio.co" },
];

const communityLinks: { label: string; href: string; Icon: IconType }[] = [
  { label: "GitHub",    href: "https://github.com/gdgcnitj",                              Icon: FaGithub   },
  { label: "WhatsApp",  href: "https://chat.whatsapp.com/Dxe6XJ8dXKnKPN5ClLB0KU?mode=gi_t", Icon: FaWhatsapp },
];

const socialLinks: { label: string; href: string; Icon: IconType }[] = [
  { label: "Instagram", href: "https://www.instagram.com/gdgcnitj",          Icon: FaInstagram  },
  { label: "Twitter",   href: "https://x.com/GDSCNitj",                      Icon: FaXTwitter   },
  { label: "LinkedIn",  href: "https://www.linkedin.com/company/dscnitj",    Icon: FaLinkedinIn },
];

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
            <p className="footer-brand-org">GDG on Campus · NIT Jalandhar</p>
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
        <p>© 2026 GDG on Campus, NIT Jalandhar. All rights reserved.</p>
      </div>
    </footer>
  );
}
