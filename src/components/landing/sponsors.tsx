"use client";

import React, { useState } from 'react';
import SectionHeading from '@/components/ui/SectionHeading';
import './Sponsors.css';
import sponserOrnament from "../../../public/images/SponserOrnament.png";
import vector from "../../../public/images/Vector.png";
import sponserTag from "../../../public/images/sponserTag.png";
import sponserHook from "../../../public/images/SponsersHook.png";

interface Sponsor {
  id: number;
  name: string;
  prize: string;
  description: string;
  task: string;
}

const sponsorData: Sponsor[] = [
  { 
    id: 1, 
    name: 'POLYGON', 
    prize: 'XXXXX', 
    description: 'Write Something About Company.........', 
    task: 'Write About Task To Be Eligible For This Company Track.....' 
  },
  { 
    id: 2, 
    name: 'POLYGON', 
    prize: 'XXXXX', 
    description: 'Write Something About Company.........', 
    task: 'Write About Task To Be Eligible For This Company Track.....' 
  },
  { 
    id: 3, 
    name: 'POLYGON', 
    prize: 'XXXXX', 
    description: 'Write Something About Company.........', 
    task: 'Write About Task To Be Eligible For This Company Track.....' 
  },
  { 
    id: 4, 
    name: 'POLYGON', 
    prize: 'XXXXX', 
    description: 'Write Something About Company.........', 
    task: 'Write About Task To Be Eligible For This Company Track.....' 
  },
];

export default function Sponsors() {
  const [activeTab, setActiveTab] = useState<number>(0);
  const currentSponsor = sponsorData[activeTab];

  return (
    <div className="sponsor-container" id="sponsors">
      <SectionHeading
        title="OUR"
        highlight="SPONSORS"
        highlightPosition="after"
        description="Build with leading companies and compete for exclusive sponsor prizes."
      />
      <div className="sponsor-layout">
        {/* Left Sidebar */}
        <div className="sponsor-sidebar">
          {sponsorData.map((s, index) => {
            const isActive = activeTab === index;
            return (
              <React.Fragment key={s.id}>
                {/* Ornament above active item */}
                {isActive && (
                  <img src={sponserHook.src} alt="top-ornament" className="sidebar-active-ornament" />
                )}
                
                <div 
                  className={`sidebar-item ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveTab(index)}
                >
                  <img src={sponserTag.src} alt="Sponsor Icon" />
                  {s.name}
                </div>

                {/* Ornament below active item (flipped) */}
                {isActive && (
                  <img 
                    src={sponserHook.src} 
                    alt="bottom-ornament" 
                    className="sidebar-active-ornament-flipped" 
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Center Logo Area */}
        <div className="sponsor-center-display">
          <div className="vertical-divider"></div>
          
          <div className="logo-glow-box">
             {/* The name is kept clear via CSS z-index and pseudo-elements */}
             <div className="placeholder-logo">{currentSponsor.name}</div>
          </div>
          
          <div className="vertical-divider"></div>
        </div>

        {/* Right Info Area */}
        <div className="sponsor-details">
          <h2 className="detail-name">{currentSponsor.name}</h2>
          <p className="detail-description">{currentSponsor.description}</p>
          
          <div className="ornate-divider">
            <img src={vector.src} alt="Divider" />
          </div>

          <p className="detail-task">{currentSponsor.task}</p>
          
          <div className="prize-box">
            PRIZE AMOUNT - <span className="prize-value">Rs. {currentSponsor.prize}</span>
          </div>
        </div>
      </div>
      
      <div className="footer-ornament">
        <img src={sponserOrnament.src} alt="Footer Ornament" />
      </div>
    </div>
  );
}