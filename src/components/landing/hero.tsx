"use client";

import Image from "next/image";
import "./hero.css";

export default function Hero() {
  return (
    <>
      {/* Background Effects */}
      <div className="background-container">
        <div className="radial-glow"></div>
      </div>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          {/* Character FIRST (background element) */}
          <div className="character-container">
            <Image
              src="/images/hollow_knight.png"
              alt="Knight Character"
              fill
              className="character"
              priority
            />
          </div>

          {/* Logo OVERLAY */}
          <div className="logo-overlay">
            <Image
              src="/images/hackmol_logo.png"
              alt="HackMol 7.0"
              width={1000}
              height={300}
              className="logo-ornament"
              priority
            />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="scroll-indicator">
          <Image
            src="/images/scroll_down.png"
            alt="Scroll Down"
            width={30}
            height={30}
            className="scroll-arrow"
          />
        </div>
      </section>
    </>
  );
}
