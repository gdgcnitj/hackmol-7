"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";
import { timelineEvents as timelineData } from "@/data/timeline";
import "./timeline.css";

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
                src="/assets/timeline/timelineVines.png"
                alt=""
                width={800}
                height={800}
                priority
              />
            </div>
            <div className="timeline-character-vessel">
              <Image
                src="/assets/timeline/timelinePureVessel.png"
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
                          ? "/assets/timeline/timelineBulletBlue.png"
                          : "/assets/timeline/timelineBulletWhite.png"
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
