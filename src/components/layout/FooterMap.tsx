"use client";

import { siteConfig } from "@/data/site";

const MAP_URL = siteConfig.venue.mapUrl;
const EMBED_SRC = siteConfig.venue.mapEmbedSrc;

export default function FooterMap() {
  return (
    <div
      className="footer-map-wrapper"
      onClick={() => window.open(MAP_URL, "_blank", "noopener,noreferrer")}
      title="Open in Google Maps"
    >
      <iframe
        src={EMBED_SRC}
        width="100%"
        height="100%"
        style={{ border: 0, display: "block", pointerEvents: "none" }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        tabIndex={-1}
        aria-hidden="true"
      />
      <div className="footer-map-overlay">
        <span>Open in Google Maps ↗</span>
      </div>
    </div>
  );
}
