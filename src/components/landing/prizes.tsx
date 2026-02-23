// export default function Prizes() {
//     return (
//         <div>
//         Prizes Section
//         </div>
//     )
// }
// import React from "react";
// import "./Prizes.css";
// import leftcorner from "../../../public/images/corner-left.png";
// const Prizes: React.FC = () => {
//   return (
//     <section className="prizes-section">

//       {/* Corner Decorations */}
//       <Image src={leftcorner.src} className="corner left" fill alt=""/>
//       <img src="/assets/corner-right.svg" className="corner right" alt="corner" />

//       <h1 className="title">PRIZES</h1>

//       <div className="cards-container">

//         {/* 2nd Prize */}
//         <div className="prize-card">
//           <img src="/assets/bat-2.svg" className="card-icon" alt="2nd prize icon" />
//           <h2>2nd Prize</h2>
//           <p className="amount">Rs. XXXX</p>

//           <ul>
//             <li>Goodies</li>
//             <li>Geeks for Geeks (800/- INR coupon)</li>
//             <li>Echo-ar Free premium tier services</li>
//             <li>Online Mock Interviews</li>
//             <li>Lifetime upgrades</li>
//           </ul>
//         </div>

//         {/* 1st Prize */}
//         <div className="prize-card first">
//           <img src="/assets/bat-1.svg" className="card-icon main" alt="1st prize icon" />
//           <h2>1st Prize</h2>
//           <p className="amount">Rs. XXXX</p>

//           <ul>
//             <li>Goodies</li>
//             <li>Geeks for Geeks (800/- INR coupon)</li>
//             <li>Echo-ar Free premium tier services</li>
//             <li>Online Mock Interviews</li>
//             <li>Lifetime upgrades</li>
//           </ul>
//         </div>

//         {/* 3rd Prize */}
//         <div className="prize-card">
//           <img src="/assets/bat-3.svg" className="card-icon" alt="3rd prize icon" />
//           <h2>3rd Prize</h2>
//           <p className="amount">Rs. XXXX</p>

//           <ul>
//             <li>Goodies</li>
//             <li>Geeks for Geeks (800/- INR coupon)</li>
//             <li>Echo-ar Free premium tier services</li>
//             <li>Online Mock Interviews</li>
//             <li>Lifetime upgrades</li>
//           </ul>
//         </div>

//       </div>

//       {/* Side Characters */}
//       <img src="/assets/knight-left.png" className="character left-character" alt="left character" />
//       <img src="/assets/knight-right.png" className="character right-character" alt="right character" />

//     </section>
//   );
// };

// export default Prizes;

"use client";

import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";
import "./Prizes.css";

// Asset imports
import batFirst from "../../../public/images/bat-first.png";
import batSecond from "../../../public/images/bat-second.png";
import batThird from "../../../public/images/bat-third.png";
import upperframe from "../../../public/images/upperframe.png";
import lowerframe from "../../../public/images/lowerframe.png";

const topPrizesData = [
  {
    title: "The Shadow Relic",
    subtitle: "Second Place: ₹30,000",
    amount: "₹30,000",
    icon: batSecond,
    rank: "2nd",
    description: "For the team delivering a highly impressive and technically strong solution.",
  },
  {
    title: "The Abyss Crown",
    subtitle: "First Place: ₹50,000",
    amount: "₹50,000",
    icon: batFirst,
    highlight: true,
    rank: "1st",
    description: "Awarded to the team that demonstrates exceptional innovation, execution, and impact.",
  },
  {
    title: "The Crystal Honor",
    subtitle: "Third Place: ₹10,000",
    amount: "₹10,000",
    icon: batThird,
    rank: "3rd",
    description: "Recognizing a standout project with strong potential and creativity.",
  },
];

const specialPrizesData = [
  {
    title: "The Lantern of Beginnings",
    subtitle: "Fresher's Track: ₹10,000",
    amount: "₹10,000",
    category: "Fresher's Track",
    description: "Celebrating the most promising and well-executed project by fresh innovators.",
  },
  {
    title: "The Queen's Emblem",
    subtitle: "Women Track: ₹10,000",
    amount: "₹10,000",
    category: "Women Track",
    description: "Awarded to the most outstanding women-led innovation of HackMOL 7.0.",
  },
];

export default function Prizes() {
  return (
    <div className="prizes-section" id="prizes">
      <SectionHeading
        title="PRIZES &"
        highlight="REWARDS"
        highlightPosition="after"
        description="The realm's greatest honors await. Over $1,080 in total prizes for those who dare to forge legendary solutions."
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
                  src="/images/dotsbg.png"
                  width={600}
                  height={200}
                  alt=""
                  className="highlight-dots"
                />
              )}
              <Image
                src={prize.icon}
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
        src="/images/knight-right.png"
        alt="Knight decoration"
        width={200}
        height={300}
        className="side-character left"
      />

      <Image
        src="/images/knight-left.png"
        alt="Knight decoration"
        width={200}
        height={300}
        className="side-character right"
      />
    </div>
  );
}
