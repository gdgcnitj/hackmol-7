"use client";

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import "./faq.css"; // Import your custom CSS

const CATEGORY_DATA = {
  GENERAL: [
    { question: "What is Hackmol 7.0?", answer: "Hackmol 7.0 is a flagship hackathon organized to foster innovation and creativity among students." },
    { question: "Who is eligible to participate in the hackathon?", answer: "All university students are eligible to participate, regardless of their major or year of study." },
    { question: "When and where will the hackathon take place?", answer: "The event is scheduled to take place at our main campus. Detailed schedules will be sent via email." },
    { question: "Is this hackathon online or offline?", answer: "This is a fully offline, in-person event to ensure the best collaborative experience." },
    { question: "What's the cost?", answer: "Admission is free and includes mentors, workshops, food, $wag, resources, and an unforgettable experience!" },
  ],
  REGISTER: [
    { question: "How do I register for Hackmol 7.0?", answer: "You can register through our official portal by clicking the 'Register Now' button on the home page." },
    { question: "Is there a registration deadline?", answer: "Yes, registrations usually close one week before the event starts. Keep an eye on our socials!" },
    { question: "Can I register as an individual?", answer: "Yes, you can register individually and we will help you find a team during the networking session." }
  ],
  PAY: [
    { question: "Is there any hidden fee?", answer: "None at all. The event is completely free for all shortlisted participants." },
    { question: "Do I need to pay for food?", answer: "No, meals and snacks are provided free of charge throughout the duration of the hackathon." }
  ],
  EXPENSE: [
    { question: "Will travel expenses be reimbursed?", answer: "Travel reimbursement is provided on a case-by-case basis depending on sponsorships. Check your acceptance email for details." },
    { question: "What should I bring with me?", answer: "Bring your laptop, charger, and any hardware you plan to use. Sleeping bags are recommended for overnight stay!" }
  ]
};

export default function FAQ() {
  const [activeTab, setActiveTab] = useState('GENERAL');
  const [openIndex, setOpenIndex] = useState(-1); // Default open

  const tabs = Object.keys(CATEGORY_DATA);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setOpenIndex(-1);
  };

  return (
    <section className="faq-section">
      <div className="faq-container">
        
        {/* Header Section */}
        <div className="faq-header">
          <h2 className="faq-title cinzel-font">Got Questions?</h2>
          <p className="faq-subtitle cinzel-font">
            We&apos;ve got answers. Find everything you <br className="desktop-only" />
            need to know about Hackmol 7.0 here.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="faq-tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`faq-tab-btn cinzel-font ${activeTab === tab ? 'active' : ''}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Accordion List */}
        <div className="faq-accordion-list">
          {CATEGORY_DATA[activeTab as keyof typeof CATEGORY_DATA].map((item, index) => (
            <div
              key={`${activeTab}-${index}`}
              className={`faq-item ${openIndex === index ? "is-open" : ""}`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                className="faq-question-btn"
              >
                <span className="question-text">
                  {item.question}
                </span>
                <ChevronDown 
                  size={24} 
                  className="chevron-icon" 
                />
              </button>

              <div className="faq-answer-wrapper">
                <div className="faq-answer-content">
                  {item.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}