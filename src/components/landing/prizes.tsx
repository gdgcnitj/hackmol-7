"use client";

import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";
import { topPrizes as topPrizesData, specialPrizes as specialPrizesData } from "@/data/prizes";
import "./Prizes.css";

// Asset imports (static images for Next.js optimisation)
import batFirst from "../../../public/assets/prizes/bat-first.png";
import batSecond from "../../../public/assets/prizes/bat-second.png";
import batThird from "../../../public/assets/prizes/bat-third.png";
import upperframe from "../../../public/assets/prizes/upperframe.png";
import lowerframe from "../../../public/assets/prizes/lowerframe.png";
import type { StaticImageData } from "next/image";

/** Map icon paths from data layer to static imports */
const prizeIconMap: Record<string, StaticImageData> = {
  "/assets/prizes/bat-first.png": batFirst,
  "/assets/prizes/bat-second.png": batSecond,
  "/assets/prizes/bat-third.png": batThird,
};

export default function Prizes() {
  return (
    <div className="prizes-section" id="prizes">
      <SectionHeading
        title="PRIZES &"
        highlight="REWARDS"
        highlightPosition="after"
        description="The realm's greatest honors await. Over ₹1,00,000+ in total prizes for those who dare to forge legendary solutions."
      />

      {/* TOP 3 PRIZES */}
      <div className="top-prizes-container">
        {topPrizesData.map((prize, index) => (
          <div
            key={index}
            className={`prize-card ${prize.highlight ? "prize-highlight" : ""}`}
            data-prize={prize.rank}
          >
            <div className="prize-icon-wrapper">
              {prize.highlight && (
                <Image
                  src="/assets/prizes/dotsbg.png"
                  width={600}
                  height={200}
                  alt=""
                  className="highlight-dots"
                />
              )}
              <Image
                src={prizeIconMap[prize.iconPath] || prize.iconPath}
                alt={prize.title}
                width={prize.highlight ? 280 : 150}
                height={prize.highlight ? 280 : 150}
                className="prize-icon"
                priority={prize.highlight}
              />
            </div>

            <div className="prize-content">
              <div className="frame-decorator">
                <Image src={upperframe} alt="" className="frame-img" />
              </div>

              <h3 className="prize-title">{prize.title}</h3>
              <p className="prize-subtitle">{prize.subtitle}</p>
              <p className="prize-description">{prize.description}</p>

              <div className="frame-decorator">
                <Image src={lowerframe} alt="" className="frame-img" />
              </div>
            </div>

            <p className="prize-bonus">+ Swags & Goodies</p>
          </div>
        ))}
      </div>

      {/* SPECIAL CATEGORY PRIZES */}
      <div className="special-prizes-container">
        {specialPrizesData.map((prize, index) => (
          <div key={index} className="special-prize-card">
            <div className="special-prize-header">
              <span className="category-badge">{prize.category}</span>
            </div>
            <h4 className="special-prize-title">{prize.title}</h4>
            <p className="special-prize-subtitle">{prize.subtitle}</p>
            <p className="special-prize-description">{prize.description}</p>
          </div>
        ))}
      </div>

      {/* SIDE CHARACTERS */}
      <Image
        src="/assets/decorative/knight-right.png"
        alt="Knight decoration"
        width={200}
        height={300}
        className="side-character left"
      />

      <Image
        src="/assets/decorative/knight-left.png"
        alt="Knight decoration"
        width={200}
        height={300}
        className="side-character right"
      />
    </div>
  );
}
