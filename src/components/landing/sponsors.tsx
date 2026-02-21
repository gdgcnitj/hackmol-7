"use client";

import React, { useState, useEffect } from "react";
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
  { key: "community", title: "Community" },
];

const sponsors: Sponsor[] = [
  /* Gold — 1 per row */
   { name: "Sponsor 1", logo: "",                           label: "Cloud Partner",      link: "#",                       category: "gold" },

  /* Silver — 2 per row */
  { name: "Devfolio",  logo: "/images/devfolio_white.png", label: "Platform Partner",   link: "https://devfolio.co",    category: "silver" },
  { name: "Sponsor 2", logo: "",                           label: "Cloud Partner",      link: "#",                       category: "silver" },

  /* Bronze — 3 per row */
  { name: "Sponsor 3", logo: "",                           label: "Design Partner",     link: "#",                       category: "bronze" },
  { name: "Sponsor 4", logo: "",                           label: "API Partner",        link: "#",                       category: "bronze" },
  { name: "Sponsor 5", logo: "",                           label: "Data Partner",       link: "#",                       category: "bronze" },

  /* Community — 3 per row */
  {
    name: "Community 1",
    logo: "",
    label: "Community Partner",
    link: "#",
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
  {
    name: "Community 7",
    logo: "",
    label: "Community Partner",
    link: "#",
    category: "community"
  },
  {
    name: "Community 8",
    logo: "",
    label: "Community Partner",
    link: "#",
    category: "community"
  },
  {
    name: "Community 9",
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
  const [active, setActive] = useState<Category>("silver");
  const filtered = sponsors.filter((s) => s.category === active);

  return (
    <div className="sponsor-container" id="sponsors">
      <SectionHeading
        title="OUR"
        highlight="SPONSORS"
        highlightPosition="after"
        description="The great houses of the kingdom. Their support lights the path through HackMol 7.0."
      />

      <div className="sponsor-layout">
        {/* ── Left: Category filters ── */}
        <aside className="sponsor-sidebar">
          {categories.map((cat) => {
            const isActive = active === cat.key;
            return (
              <React.Fragment key={cat.key}>
                {/* Top ornament for active */}
                {isActive && (
                  <Image src={upperFrame} alt="" className="sidebar-ornament-top" width={140} height={40} />
                )}
                
                <button
                  className={`sidebar-item ${isActive ? "active" : ""}`}
                  onClick={() => setActive(cat.key)}
                >
                  <Image src={sponserTag} alt="" className="sidebar-item-icon" width={18} height={18} />
                  {cat.title}
                </button>

                {/* Bottom ornament for active */}
                {isActive && (
                  <Image src={lowerFrame} alt="" className="sidebar-ornament-bottom" width={140} height={40} />
                )}
              </React.Fragment>
            );
          })}
        </aside>

        {/* ── Right: Sponsor grid ── */}
        <div
          className="sponsor-grid"
          data-category={active}
          style={{ gridTemplateColumns: `repeat(${tierCols[active]}, 1fr)` }}
        >
          {filtered.map((s, i) => (
            <a
              key={i}
              href={s.link}
              target="_blank"
              rel="noopener noreferrer"
              className="sponsor-card"
            >
              <div className="sponsor-card-logo">
                {s.logo ? (
                  <Image src={s.logo} alt={s.name} width={160} height={56} style={{ objectFit: "contain" }} />
                ) : (
                  <span className="sponsor-card-placeholder">{s.name}</span>
                )}
              </div>
              <p className="sponsor-card-label">{s.label}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}