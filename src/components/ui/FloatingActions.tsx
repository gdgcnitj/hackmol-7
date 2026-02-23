"use client";

import { useEffect, useState } from "react";
import { HiArrowUp } from "react-icons/hi2";
import { siteConfig } from "@/data/site";
import "./FloatingActions.css";

export default function FloatingActions() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const hero = document.querySelector(".hero-scroll-section");
      const threshold = hero ? hero.getBoundingClientRect().bottom + window.scrollY : 400;
      setVisible(window.scrollY > threshold);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Desktop: Back to top */}
      <button
        className={`floating-btn floating-back-to-top ${visible ? "show" : ""}`}
        onClick={scrollToTop}
        aria-label="Back to top"
      >
        <HiArrowUp size={22} />
      </button>

      {/* Mobile: Register */}
      <a
        className="floating-btn floating-register"
        href={siteConfig.devfolioUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Register on Devfolio"
      >
        <span className="floating-register-text">Register</span>
      </a>
    </>
  );
}
