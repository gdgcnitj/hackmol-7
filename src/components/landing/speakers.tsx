"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";
import { FaLinkedin, FaInstagram } from "react-icons/fa";
import { judgesData, mentorsData } from "@/data/speakers";

import "./speakers.css";

// Asset imports
import maskCorner from "../../../public/assets/decorative/Maskgroup.png";

function useSwipe(
  itemCount: number,
  activeIndex: number,
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>
) {
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartX = useRef(0);
  const touchStartTime = useRef(0);
  const currentX = useRef(0);
  const containerWidth = useRef(0);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartX.current = touch.clientX;
    currentX.current = touch.clientX;
    touchStartTime.current = Date.now();
    // Measure carousel container width for ratio-based calcs
    const el = e.currentTarget as HTMLElement;
    containerWidth.current = el.offsetWidth || 300;
    setIsDragging(true);
    setDragOffset(0);
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    currentX.current = touch.clientX;
    let delta = touch.clientX - touchStartX.current;

    // Rubber-band resistance at edges
    const isAtStart = activeIndex === 0 && delta > 0;
    const isAtEnd = activeIndex === itemCount - 1 && delta < 0;
    if (isAtStart || isAtEnd) {
      delta = delta * 0.3; // dampen to 30%
    }

    setDragOffset(delta);
  }, [isDragging, activeIndex, itemCount]);

  const onTouchEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);

    const delta = currentX.current - touchStartX.current;
    const elapsed = Date.now() - touchStartTime.current;
    const velocity = Math.abs(delta) / Math.max(elapsed, 1); // px/ms
    const width = containerWidth.current;

    // Snap if either: swiped > 25% of width, or velocity > 0.4 px/ms (fast flick)
    const swipedEnough = Math.abs(delta) > width * 0.25;
    const flickedFast = velocity > 0.4 && Math.abs(delta) > 20;

    if (swipedEnough || flickedFast) {
      if (delta < 0 && activeIndex < itemCount - 1) {
        setActiveIndex((prev) => prev + 1);
      } else if (delta > 0 && activeIndex > 0) {
        setActiveIndex((prev) => prev - 1);
      }
    }

    // Animate offset back to 0
    setDragOffset(0);
  }, [isDragging, activeIndex, itemCount, setActiveIndex]);

  // Build the inline transform + transition
  const getTrackStyle = useCallback(
    (isMobile: boolean): React.CSSProperties => {
      if (!isMobile) return {};
      const baseTranslate = -(activeIndex * 100);
      const pxOffset = dragOffset;
      return {
        transform: `translateX(calc(${baseTranslate}% + ${pxOffset}px))`,
        transition: isDragging
          ? "none" // 1:1 finger tracking, no transition lag
          : "transform 0.45s cubic-bezier(0.32, 0.72, 0, 1)", // iOS-style spring
      };
    },
    [activeIndex, dragOffset, isDragging]
  );

  return { onTouchStart, onTouchMove, onTouchEnd, getTrackStyle, isDragging };
}

export default function Speakers() {
  const [activeJudgeIndex, setActiveJudgeIndex] = useState(0);
  const [activeMentorIndex, setActiveMentorIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const judgeSwipe = useSwipe(judgesData.length, activeJudgeIndex, setActiveJudgeIndex);
  const mentorSwipe = useSwipe(mentorsData.length, activeMentorIndex, setActiveMentorIndex);

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
  }, [isMobile, activeJudgeIndex]);

  // Auto-scroll for mentors carousel (only on mobile)
  useEffect(() => {
    if (!isMobile) return;
    
    const interval = setInterval(() => {
      setActiveMentorIndex((prev) => (prev + 1) % mentorsData.length);
    }, 4500); // Change slide every 4.5 seconds

    return () => clearInterval(interval);
  }, [isMobile, activeMentorIndex]);

  return (
    <div className="speakers-section" id="judges">
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
        <div 
          className={`carousel-container${judgeSwipe.isDragging ? ' is-dragging' : ''}`}
          onTouchStart={judgeSwipe.onTouchStart}
          onTouchMove={judgeSwipe.onTouchMove}
          onTouchEnd={judgeSwipe.onTouchEnd}
        >
          <div 
            className="cards-grid judges-grid" 
            style={judgeSwipe.getTrackStyle(isMobile)}
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
        <div 
          className={`carousel-container${mentorSwipe.isDragging ? ' is-dragging' : ''}`}
          onTouchStart={mentorSwipe.onTouchStart}
          onTouchMove={mentorSwipe.onTouchMove}
          onTouchEnd={mentorSwipe.onTouchEnd}
        >
          <div 
            className="cards-grid mentors-grid"
            style={mentorSwipe.getTrackStyle(isMobile)}
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