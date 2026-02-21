import Image from "next/image";
import "./footer.css";

const quickLinks = [
  { label: "The Team", href: "#" },
  { label: "Upcoming Events", href: "#" },
  { label: "Past Events", href: "#" },
  { label: "Join Us", href: "#" },
];

const socialLinks = [
  { label: "Instagram", href: "https://www.instagram.com/gdgcnitj/", icon: "/images/footerInstagram.svg" },
  { label: "Twitter", href: "https://x.com/GDSCNitj", icon: "/images/footerTwitter.svg" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/dscnitj/?originalSubdomain=in", icon: "/images/footerLinkedIn.svg" },
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
        <div className="footer-links">
          <h3 className="footer-links-heading">Quick Links</h3>
          <ul className="footer-links-list">
            {quickLinks.map((link, i) => (
              <li key={i}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-social">
          <h3 className="footer-social-heading">Get The Latest Tea</h3>
          <div className="footer-social-icons">
            {socialLinks.map((social, i) => (
              <a
                key={i}
                href={social.href}
                aria-label={social.label}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={social.icon}
                  alt={social.label}
                  width={44}
                  height={44}
                  className="footer-social-icon"
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
