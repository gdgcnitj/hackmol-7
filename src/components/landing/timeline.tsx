"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";
import "./timeline.css";

const timelineData = [
  {
    title: "REGISTRATION BEGINS",
    description: "Start registering for HackMol 7.0.",
    date: "Feb 24, 2026",
  },
  {
    title: "REGISTRATION ENDS",
    description: "Last day to register for HackMol 7.0.",
    date: "Mar 24, 2026",
  },
  {
    title: "PPT SUBMISSION DEADLINE",
    description: "Final presentation (PPT) submissions due.",
    date: "Mar 26, 2026",
  },
  {
    title: "HACKATHON STARTS",
    description: "Kickoff, 30-hour hackathon begins.",
    date: "Mar 28, 2026",
  },
  {
    title: "HACKATHON ENDS",
    description: "Event concludes and final judging begins.",
    date: "Mar 29, 2026",
  },
  {
    title: "WINNERS ANNOUNCED",
    description: "Winners of HackMol 7.0 are announced.",
    date: "Mar 29, 2026",
  },
];

export default function Timeline() {
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cards = cardsRef.current?.querySelectorAll(".timeline-card");
    if (!cards) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="timeline-section" id="timeline">
      <SectionHeading
        title="HACKATHON"
        highlight="TIMELINE"
        highlightPosition="after"
        description="Mark your descent. Each milestone brings you one step closer to the heart of Hallownest."
      />

      <div className="timeline-content">
        <div className="timeline-grid">
          <div className="timeline-character">
            <div className="timeline-character-vines">
              <Image
                src="/images/timelineVines.png"
                alt=""
                width={800}
                height={800}
                priority
              />
            </div>
            <div className="timeline-character-vessel">
              <Image
                src="/images/timelinePureVessel.png"
                alt="Pure Vessel character"
                width={800}
                height={800}
                priority
              />
            </div>
          </div>

          <div className="timeline-right">
            <div className="timeline-cards" ref={cardsRef}>
              {timelineData.map((item, index) => (
                <div
                  key={index}
                  className="timeline-card"
                  style={{ "--stagger": index } as React.CSSProperties}
                >
                  <div className="timeline-card-bullet">
                    <Image
                      src={
                        index % 2
                          ? "/images/timelineBulletBlue.png"
                          : "/images/timelineBulletWhite.png"
                      }
                      alt=""
                      width={30}
                      height={30}
                    />
                  </div>

                  <div className="timeline-card-text">
                    <span className="timeline-card-title">{item.title}</span>
                    <span className="timeline-card-desc">
                      {item.description}
                    </span>
                  </div>

                  <span className="timeline-card-date">{item.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
