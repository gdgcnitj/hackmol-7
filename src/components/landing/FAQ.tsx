"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import type { FAQCategoryKey } from "@/types";
import { faqData as CATEGORY_DATA } from "@/data/faq";
import "./faq.css";

// Data is now imported from @/data/faq

export default function FAQ() {
  const [activeTab, setActiveTab] = useState<FAQCategoryKey>("ABOUT");
  const [openIndex, setOpenIndex] = useState(0);

  const tabs = Object.keys(CATEGORY_DATA) as FAQCategoryKey[];

  const handleTabChange = (tab: FAQCategoryKey) => {
    setActiveTab(tab);
    setOpenIndex(0);
  };

  return (
    <section className="faq-section" id="faq">
      {/* SectionHeading is first child of section root — no h-padding here,
          so the full-bleed trick in SectionHeading works correctly */}
      <SectionHeading
        title="GOT"
        highlight="QUESTIONS?"
        highlightPosition="after"
        description="Whispers from the depths. Everything you need before you descend into HackMol 7.0."
      />

      {/* Side knight characters */}
      <Image
        src="/images/knight-right.png"
        alt=""
        width={180}
        height={260}
        className="faq-knight faq-knight--left"
        aria-hidden="true"
      />
      <Image
        src="/images/knight-left.png"
        alt=""
        width={180}
        height={260}
        className="faq-knight faq-knight--right"
        aria-hidden="true"
      />

      <div className="faq-container">

        {/* Category tabs */}
        <div className="faq-tabs" role="tablist">
          {tabs.map((tab) => (
            <button
              key={tab}
              role="tab"
              aria-selected={activeTab === tab}
              onClick={() => handleTabChange(tab)}
              className={`faq-tab-btn ${activeTab === tab ? "active" : ""}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Accordion */}
        <div className="faq-accordion-list" role="tabpanel">
          {CATEGORY_DATA[activeTab].map(
            (item, index) => (
              <div
                key={`${activeTab}-${index}`}
                className={`faq-item ${openIndex === index ? "is-open" : ""}`}
              >
                <button
                  onClick={() =>
                    setOpenIndex(openIndex === index ? -1 : index)
                  }
                  className="faq-question-btn"
                  aria-expanded={openIndex === index}
                >
                  <span className="faq-question-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="faq-question-text">{item.question}</span>
                  <ChevronDown size={22} className="faq-chevron" />
                </button>

                <div className="faq-answer-wrapper">
                  <div className="faq-answer-overflow">
                    <div className="faq-answer-content">{item.answer}</div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}