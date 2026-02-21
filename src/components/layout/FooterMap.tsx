"use client";

const MAP_URL =
  "https://www.google.com/maps/place/Dr+B+R+Ambedkar+National+Institute+of+Technology+Jalandhar/@31.3958746,75.5332690,17z";

const EMBED_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3405.662273018692!2d75.53326897662893!3d31.39587457427134!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391a51d30c180edf%3A0x5b7633718d17ef33!2sDr%20B%20R%20Ambedkar%20National%20Institute%20of%20Technology%20Jalandhar!5e0!3m2!1sen!2sin!4v1771692624813!5m2!1sen!2sin";

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
