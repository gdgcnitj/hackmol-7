"use client";

import React from "react";
import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";
import { sponsorTiers as categories, sponsors, tierColumns as tierCols } from "@/data/sponsors";
import "./Sponsors.css";
import sponserTag from "../../../public/assets/decorative/sponserTag.png";
import upperFrame from "../../../public/assets/prizes/upperframe.png";
import lowerFrame from "../../../public/assets/prizes/lowerframe.png";

/* ─── Component ─── */
export default function Sponsors() {
  return (
    <section className="sponsors-section" id="sponsors">
      <SectionHeading
        title="OUR"
        highlight="SPONSORS"
        highlightPosition="after"
        description="The great houses of the kingdom. Their support lights the path through HackMol 7.0."
      />

      <div className="sponsor-container">
        {categories.map((cat) => {
          const categorySponsors = sponsors.filter((s) => s.category === cat.key);
          
          // Skip if no sponsors in this category
          if (categorySponsors.length === 0) return null;

          return (
            <div key={cat.key} className="sponsor-tier" data-category={cat.key}>
              <div className="sponsor-tier-header">
                <Image 
                  src={upperFrame} 
                  alt="" 
                  className="tier-ornament-top" 
                  width={140} 
                  height={40}
                />
                <div className="sponsor-tier-title-wrapper">
                  <Image 
                    src={sponserTag} 
                    alt="" 
                    className="tier-icon" 
                    width={18} 
                    height={18}
                  />
                  <h2 className="sponsor-tier-title">{cat.title}</h2>
                </div>
                <Image 
                  src={lowerFrame} 
                  alt="" 
                  className="tier-ornament-bottom" 
                  width={140} 
                  height={40}
                />
              </div>
              
              <div
                className="sponsor-grid"
                data-category={cat.key}
                style={{ gridTemplateColumns: `repeat(${tierCols[cat.key]}, 1fr)` }}
              >
                {categorySponsors.map((s, i) => (
                  <a
                    key={i}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sponsor-card"
                  >
                    <div className="sponsor-card-logo">
                      {s.logo ? (
                        <Image 
                          src={s.logo} 
                          alt={s.name}
                          width={160} 
                          height={56} 
                          style={{ objectFit: "contain" }}
                          priority={s.name === "Devfolio"} 
                        />
                      ) : (
                        <span className="sponsor-card-placeholder">Logo</span>
                      )}
                    </div>
                    <h3 className="sponsor-card-name">{s.name}</h3>
                  </a>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}