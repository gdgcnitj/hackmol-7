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
import "./Prizes.css";

// Asset imports

import batFirst from "../../../public/images/bat-first.png";
import batSecond from "../../../public/images/bat-second.png";
import batThird from "../../../public/images/bat-third.png";
import prize1 from "../../../public/images/prizearrow.png";
import prize2 from "../../../public/images/prizearrow2.png";
import upperframe from "../../../public/images/upperframe.png";
import lowerframe from "../../../public/images/lowerframe.png";

const prizesData = [
  {
    title: "2nd Prize",
    amount: "Rs. XXXX",
    icon: batSecond,
  },
  {
    title: "1st Prize",
    amount: "Rs. XXXX",
    icon: batFirst,
    highlight: true,
  },
  {
    title: "3rd Prize",
    amount: "Rs. XXXX",
    icon: batThird,
  },
];

export default function Prizes() {
  return (
    <div className="prizes-section" id="prizes">

      {/* HEADER */}
      <div className="prizes-header">
        <div className="relative ornament">
          <Image src={prize1} fill alt="" className="corner-img" />
        </div>

        <h1 className="main-title">PRIZES</h1>

        <div className="relative ornament">
          <Image src={prize2} fill alt="" className="corner-img flip-x" />
        </div>
      </div>
 <Image
        src="/images/corner-left.png"
        alt="left corner"
        width={200}
        height={300}
        className="left-corner"
      />

      <Image
        src="/images/right-corner.png"
        alt="right corner"
        width={200}
        height={300}
        className="right-corner "
      />

      {/* CARDS */}
      <div className="prizes-container">
        {prizesData.map((prize, index) => (
          <div
            key={index}
            className={` ${prize.highlight ? "phighlight" : "prize-card"}`}
          >
            
            <div className="icons">
              {prize.highlight && (
                <div className="highlight-overlay">
                  <Image src="/images/dotsbg.png" width={600} height={200} alt="highlight background" className="dots" />
                </div>
              )}
              <Image
                src={prize.icon}
                alt={prize.title}
                width={100}
                height={100}
                className={` ${prize.title === '1st Prize' ? 'first-prize-icon' : 'prize-icon'}`}
               
              />
              </div>
      <div className="prize-desc">
  <div className="frame-top">
    <Image src={upperframe} alt="" className="frame" />
  </div>

  <p className="card-title">{prize.title}</p>
  <p className="cinzel-font amount">{prize.amount}</p>

  <div className="frame-bottom">
    <Image src={lowerframe} alt="" className="frame" />
  </div>
</div>
          
            <ol className="prize-list">
  <li>Goodies</li>
  <li>Geeks for Geeks (800/- INR coupon on all courses)</li>
  <li>Echo-ar Free Premium Tier Services</li>
  <li>Online Mock Interviews from Interview Buddy</li>
  <li>Lifetime Upgrades of Taskade Unlimited</li>
  <li>1 Year of 1Passwords Families</li>
  <li>3 Months of Draftbit Starter</li>
  <li>Sashido Credits</li>
  <li>30 Days Free Receipt Credits</li>
   </ol>
          </div>
        ))}
      </div>

      {/* SIDE CHARACTERS */}
      <Image
        src="/images/knight-right.png"
        alt="left character"
        width={200}
        height={300}
        className="side-character left"
      />

      <Image
        src="/images/knight-left.png"
        alt="right character"
        width={200}
        height={300}
        className="side-character right"
      />
    </div>
  );
}
