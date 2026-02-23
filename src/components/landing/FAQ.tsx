"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import "./faq.css";

const CATEGORY_DATA = {
  ABOUT: [
    {
      question: "What is HackMol 7.0?",
      answer:
        "HackMol 7.0 is NIT Jalandhar\u2019s flagship annual hackathon \u2014 a gruelling 30-hour descent where students from across India converge to build, break, and innovate. Themed around the hauntingly beautiful world of Hollow Knight, this edition invites the bold to venture into Hallownest and prove their worth.",
    },
    {
      question: "Who is eligible to participate?",
      answer:
        "Any currently enrolled undergraduate or postgraduate student from any college or university in India is welcome to enter the realm. You do not need to be from a CS or IT background \u2014 every discipline has a place in Hallownest.",
    },
    {
      question: "How large can a team be?",
      answer:
        "Teams can have 2 to 4 members. Solo registrations are also accepted; you will be given an opportunity to form a team during the pre-event networking session.",
    },
    {
      question: "Is this an online or offline event?",
      answer:
        "HackMol 7.0 is a fully offline, in-person hackathon. The experience \u2014 the mentors, the workshops, the late-night grind \u2014 is designed to be lived, not streamed.",
    },
    {
      question: "Why HackMol?",
      answer:
        "HackMol is happening alongside Utkansh — NIT Jalandhar's Annual Fest. So you get to witness a star night right in the middle of building. Code through the day, celebrate through the night.",
    },
  ],
  REGISTER: [
    {
      question: "How do I register?",
      answer:
        "Click the \u2018Register Now\u2019 button on this page. You will be redirected to our Devfolio portal where you can create or join a team, submit your details, and complete your application.",
    },
    {
      question: "What is the registration deadline?",
      answer:
        "Applications close on March 24, 2026. Do not wait, spots in Hallownest are limited and shortlisting is competitive.",
    },
    {
      question: "When will I hear back after applying?",
      answer:
        "Shortlisted teams will receive a confirmation email by March 20, 2026. Check your spam folder and ensure you applied with an active email address.",
    },
    {
      question: "Can all-female or mixed-gender teams participate?",
      answer:
        "Absolutely. We actively encourage diverse teams. There is a dedicated Women\u2019s Track with its own prize pool to celebrate and amplify underrepresented builders.",
    },
    {
      question: "Is it mandatory to submit a PPT before the event?",
      answer:
        "Yes. Shortlisted teams must submit a presentation of their project idea by March 26, 2026. This helps mentors prepare to guide you during the hackathon.",
    },
  ],
  LOGISTICS: [
    {
      question: "Will travel expenses be reimbursed?",
      answer: "No travel reimbursements will be provided. Participants are responsible for their own transportation to and from the venue.",
    },
    {
      question: "What should I bring?",
      answer:
        "Bring your laptop, charger, necessary hardware components, a valid college ID.",
    },
    {
      question: "Is there a code of conduct?",
      answer:
        "Yes. HackMol follows a strict code of conduct to ensure a safe, inclusive, and fair environment for all. Harassment, plagiarism, or unsportsmanlike behaviour will result in immediate disqualification.",
    },
    {
      question: "Are meals provided during the event?",
      answer:
        "Yes. All meals, snacks, and beverages throughout the 30-hour hackathon are provided free of charge. You focus on building; we\u2019ll keep you fuelled.",
    },
    {
      question: "Will accommodation be arranged?",
      answer:
        "On-campus accommodation is available for outstation participants. Details will be shared in your acceptance email. Local participants are welcome to use the rest areas on-site.",
    },
  ],
};

export default function FAQ() {
  const [activeTab, setActiveTab] = useState("ABOUT");
  const [openIndex, setOpenIndex] = useState(0);

  const tabs = Object.keys(CATEGORY_DATA);

  const handleTabChange = (tab: string) => {
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