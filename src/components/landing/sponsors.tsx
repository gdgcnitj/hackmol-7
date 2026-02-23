"use client";

import React from "react";
import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";
import "./Sponsors.css";
import sponserTag from "../../../public/images/sponserTag.png";
import upperFrame from "../../../public/images/upperframe.png";
import lowerFrame from "../../../public/images/lowerframe.png";

/* ─── Types ─── */
type Category = "gold" | "silver" | "bronze" | "community";

interface Sponsor {
  name: string;
  logo: string;
  label: string;          /* e.g. "Platform Partner" */
  link: string;
  category: Category;
}

/* ─── Data ─── */
const categories: { key: Category; title: string }[] = [
  { key: "gold",      title: "Gold Sponsors" },
  { key: "silver",    title: "Silver Sponsors" },
  { key: "bronze",    title: "Bronze Sponsors" },
  { key: "community", title: "Community Partners" },
];

const sponsors: Sponsor[] = [
  /* Gold — 1 per row */
  { 
    name: "Sponser 1",
    logo: "",
    label: "Title Sponsor",
    link: "#",
    category: "gold"
  },

  /* Silver — 2 per row */
  { 
    name: "Devfolio",
    logo: "/images/devfolio_white.png",
    label: "Official Platform Partner",
    link: "https://devfolio.co",
    category: "silver"
  },
  { name: "Gofr",
    logo: "/images/gofr_logo.svg",
    label: "Framework Partner",
    link: "https://gofr.dev/",
    category: "silver"
  },

  /* Bronze — 3 per row */
  { name: "Sponsor 3", logo: "",                           label: "Design Partner",     link: "#",                       category: "bronze" },
  { name: "Sponsor 4", logo: "",                           label: "API Partner",        link: "#",                       category: "bronze" },
  { name: "Sponsor 5", logo: "",                           label: "Data Partner",       link: "#",                       category: "bronze" },

  /* Community — 3 per row */
  {
    name: "GDGC NIT Jalandhar",
    logo: "/images/gdgc-nitj.png",
    label: "Community Partner",
    link: "https://github.com/gdgcnitj",
    category: "community"
  },
  {
    name: "Community 2",
    logo: "",
    label: "Community Partner",
    link: "#",
    category: "community"
  },
  {
    name: "Community 3",
    logo: "",
    label: "Community Partner",
    link: "#",
    category: "community"
  },
  {
    name: "Community 4",
    logo: "",
    label: "Community Partner",
    link: "#",
    category: "community"
  },
  {
    name: "Community 5",
    logo: "",
    label: "Community Partner",
    link: "#",
    category: "community"
  },
  {
    name: "Community 6",
    logo: "",
    label: "Community Partner",
    link: "#",
    category: "community"
  },
];

/* Column count per tier */
const tierCols: Record<Category, number> = {
  gold: 1,
  silver: 2,
  bronze: 3,
  community: 3,
};

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
            <div key={cat.key} className="sponsor-tier">
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
                  <div
                    key={i}
                    className="sponsor-card"
                  >
                    <div className="sponsor-card-logo">
                      {s.logo ? (
                        <Image 
                          src={s.logo} 
                          alt={s.name === "Devfolio" ? "Devfolio" : `${s.name} - ${s.label}`} 
                          width={160} 
                          height={56} 
                          style={{ objectFit: "contain" }}
                          priority={s.name === "Devfolio"} 
                        />
                      ) : (
                        <span className="sponsor-card-placeholder">Logo</span>
                      )}
                    </div>
                    <p className="sponsor-card-label">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Hidden sponsors section for crawlers */}
        <div className="sponsors-seo-section" style={{ opacity: 0, position: 'absolute', left: '-9999px' }}>
          {sponsors.filter(s => s.logo).map((sponsor, i) => (
            <img 
              key={i}
              src={sponsor.logo} 
              alt={sponsor.name === "Devfolio" ? "Devfolio" : sponsor.name} 
              width="1" 
              height="1"
            />
          ))}
        </div>
      </div>
    </section>
  );
}