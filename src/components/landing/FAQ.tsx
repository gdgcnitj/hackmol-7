"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import "./faq.css";

const CATEGORY_DATA = {
  GENERAL: [
    {
      question: "What is Hackmol 7.0?",
      answer:
        "HackMol 7.0 is NIT Jalandhar\u2019s flagship 30-hour hackathon organized to foster innovation and creativity among students nationwide.",
    },
    {
      question: "Who is eligible to participate in the hackathon?",
      answer:
        "All university students are eligible to participate, regardless of their major or year of study.",
    },
    {
      question: "When and where will the hackathon take place?",
      answer:
        "March 28\u201329, 2026 (30 hours) at NIT Jalandhar campus. Starts 8 AM on March 28 and ends 2 PM on March 29.",
    },
    {
      question: "Is this hackathon online or offline?",
      answer:
        "This is a fully offline, in-person event to ensure the best collaborative experience.",
    },
    {
      question: "What\u2019s the cost?",
      answer:
        "Admission is free and includes mentors, workshops, food, swag, resources, and an unforgettable experience!",
    },
  ],
  REGISTER: [
    {
      question: "How do I register for Hackmol 7.0?",
      answer:
        "You can register through our official portal by clicking the \u2018Register Now\u2019 button on the home page.",
    },
    {
      question: "Is there a registration deadline?",
      answer:
        "Yes, registrations close on February 24, 2026. Don\u2019t miss out!",
    },
    {
      question: "Can I register as an individual?",
      answer:
        "Yes, you can register individually and we will help you find a team during the networking session.",
    },
  ],
  PAY: [
    {
      question: "Is there any hidden fee?",
      answer:
        "None at all. The event is completely free for all shortlisted participants.",
    },
    {
      question: "Do I need to pay for food?",
      answer:
        "No, meals and snacks are provided free of charge throughout the duration of the hackathon.",
    },
  ],
  EXPENSE: [
    {
      question: "Will travel expenses be reimbursed?",
      answer:
        "Travel reimbursement is provided on a case-by-case basis depending on sponsorships. Check your acceptance email for details.",
    },
    {
      question: "What should I bring with me?",
      answer:
        "Bring your laptop, charger, and any hardware you plan to use. Sleeping bags are recommended for overnight stay!",
    },
  ],
};

export default function FAQ() {
  const [activeTab, setActiveTab] = useState("GENERAL");
  const [openIndex, setOpenIndex] = useState(-1);

  const tabs = Object.keys(CATEGORY_DATA);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setOpenIndex(-1);
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
          {CATEGORY_DATA[activeTab as keyof typeof CATEGORY_DATA].map(
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
                  <div className="faq-answer-content">{item.answer}</div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}