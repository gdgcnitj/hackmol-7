"use client";

import { useState, useEffect } from "react";
import Image, { StaticImageData } from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";
import { FaLinkedin, FaInstagram } from "react-icons/fa";

import "./speakers.css";

// Asset imports
import maskCorner from "../../../public/images/Maskgroup.png";
import hackmolLogo from "../../../public/images/hackmol_logo.png";

interface PersonData {
  name: string;
  designation: string;
  category: string;
  image: StaticImageData;
  linkedin?: string;
  instagram?: string;
}

const judgesData: PersonData[] = [
  {
    name: "TO BE ANNOUNCED",
    designation: "SDE @Microsoft",
    category: "JUDGE",
    image: hackmolLogo,
    linkedin: "#",
    instagram: "#",
  },
  {
    name: "TO BE ANNOUNCED",
    designation: "Product Manager @Google",
    category: "JUDGE",
    image: hackmolLogo,
    linkedin: "#",
    instagram: "#",
  },
  {
    name: "TO BE ANNOUNCED",
    designation: "Tech Lead @Amazon",
    category: "JUDGE",
    image: hackmolLogo,
    linkedin: "#",
    instagram: "#",
  },
];

const mentorsData: PersonData[] = Array(5).fill({
  name: "TO BE ANNOUNCED",
  designation: "Senior Engineer @Meta",
  category: "MENTOR",
  image: hackmolLogo,
  linkedin: "#",
  instagram: "#",
});

export default function Speakers() {
  const [activeJudgeIndex, setActiveJudgeIndex] = useState(0);
  const [activeMentorIndex, setActiveMentorIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Check if screen is mobile/tablet
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-scroll for judges carousel (only on mobile)
  useEffect(() => {
    if (!isMobile) return;
    
    const interval = setInterval(() => {
      setActiveJudgeIndex((prev) => (prev + 1) % judgesData.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [isMobile]);

  // Auto-scroll for mentors carousel (only on mobile)
  useEffect(() => {
    if (!isMobile) return;
    
    const interval = setInterval(() => {
      setActiveMentorIndex((prev) => (prev + 1) % mentorsData.length);
    }, 4500); // Change slide every 4.5 seconds

    return () => clearInterval(interval);
  }, [isMobile]);

  return (
    <div className="speakers-section">
      {/* HEADER SECTION */}
      <SectionHeading
        title="JUDGES &"
        highlight="MENTORS"
        highlightPosition="after"
        description="The ancients of the hollow. Shaped by the depths, here to guide you through yours."
      />

      {/* JUDGES SECTION */}
      <div className="category-wrapper">
        <h2 className="category-title cinzel-font">JUDGES</h2>
        <div className="carousel-container">
          <div 
            className="cards-grid judges-grid" 
            style={isMobile ? { transform: `translateX(-${activeJudgeIndex * 100}%)` } : {}}
          >
            {judgesData.map((person, index) => (
              <div key={`judge-${index}`} className="speaker-card">
              <div className="card-corner-wrapper">
                <Image src={maskCorner.src} fill alt="" className="card-corner top-l" />
              </div>
              <div className="card-corner-wrapper">
                <Image src={maskCorner.src} fill alt="" className="card-corner bottom-r" />
              </div>

              <div className="avatar-wrapper">
                <div className="image-border">
                  <Image
                    src={person.image}
                    alt={person.name}
                    width={350}
                    height={350}
                    className="avatar-img"
                  />
                </div>
              </div>

              <div className="card-content">
                <h3 className="cinzel-font card-name">{person.name}</h3>
                <p className="cinzel-font card-designation">{person.designation}</p>
                <p className="cinzel-font card-category">{person.category}</p>
              </div>

              <div className="social-links">
                {person.linkedin && (
                  <a href={person.linkedin} target="_blank" rel="noopener noreferrer" className="social-icon">
                    <FaLinkedin />
                  </a>
                )}
                {person.instagram && (
                  <a href={person.instagram} target="_blank" rel="noopener noreferrer" className="social-icon">
                    <FaInstagram />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
        </div>
        
        {/* Judges Navigation Dots */}
        <div className="carousel-dots">
          {judgesData.map((_, index) => (
            <button
              key={`judge-dot-${index}`}
              className={`dot ${index === activeJudgeIndex ? "active" : ""}`}
              onClick={() => setActiveJudgeIndex(index)}
              aria-label={`Go to judge ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* MENTORS SECTION */}
      <div className="category-wrapper">
        <h2 className="category-title cinzel-font">MENTORS</h2>
        <div className="carousel-container">
          <div 
            className="cards-grid mentors-grid"
            style={isMobile ? { transform: `translateX(-${activeMentorIndex * 100}%)` } : {}}
          >
          {mentorsData.map((person, index) => (
            <div key={`mentor-${index}`} className="speaker-card">
              <div className="card-corner-wrapper">
                <Image src={maskCorner.src} fill alt="" className="card-corner top-l" />
              </div>
              <div className="card-corner-wrapper">
                <Image src={maskCorner.src} fill alt="" className="card-corner bottom-r" />
              </div>

              <div className="avatar-wrapper">
                <div className="image-border">
                  <Image
                    src={person.image}
                    alt={person.name}
                    width={350}
                    height={350}
                    className="avatar-img"
                  />
                </div>
              </div>

              <div className="card-content">
                <h3 className="cinzel-font card-name">{person.name}</h3>
                <p className="cinzel-font card-designation">{person.designation}</p>
                <p className="cinzel-font card-category">{person.category}</p>
              </div>

              <div className="social-links">
                {person.linkedin && (
                  <a href={person.linkedin} target="_blank" rel="noopener noreferrer" className="social-icon">
                    <FaLinkedin />
                  </a>
                )}
                {person.instagram && (
                  <a href={person.instagram} target="_blank" rel="noopener noreferrer" className="social-icon">
                    <FaInstagram />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
        </div>
        
        {/* Mentors Navigation Dots */}
        <div className="carousel-dots">
          {mentorsData.map((_, index) => (
            <button
              key={`mentor-dot-${index}`}
              className={`dot ${index === activeMentorIndex ? "active" : ""}`}
              onClick={() => setActiveMentorIndex(index)}
              aria-label={`Go to mentor ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}