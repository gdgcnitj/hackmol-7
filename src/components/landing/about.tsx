"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";
import type { StatItem } from "@/types";
import { stats as STATS, aboutContent } from "@/data/about";
import "./about.css";

/* ─── Count-up hook ─────────────────────────────────────────────────────── */
function useCountUp(target: number, duration = 1600, enabled = false): number {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!enabled) return;
        let animId: number;
        const startTime = performance.now();

        const tick = (now: number) => {
            const progress = Math.min((now - startTime) / duration, 1);
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * target));
            if (progress < 1) animId = requestAnimationFrame(tick);
        };

        animId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(animId);
    }, [target, duration, enabled]);

    return count;
}

/* ─── Single stat card ───────────────────────────────────────────────────── */
function StatCard({ stat, animate }: { stat: StatItem; animate: boolean }) {
    const display = useCountUp(stat.end, 1600, animate);

    return (
        <div className={`about-stat-card ${stat.card}`} role="figure" aria-label={`${stat.end}${stat.suffix} ${stat.label}`}>
            <div className="about-stat-inner">
                <span className="about-stat-number">
                    {display.toLocaleString()}{stat.suffix}
                </span>
                <span className="about-stat-label">{stat.label}</span>
            </div>
        </div>
    );
}

/* ─── Section ────────────────────────────────────────────────────────────── */
export default function About() {
    const statsRef = useRef<HTMLDivElement>(null);
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        const el = statsRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setAnimate(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.25 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <section className="about-section" id="about">
            <div className="about-container">

                {/* Title */}
                <SectionHeading
                    title={aboutContent.heading.title}
                    highlight={aboutContent.heading.highlight}
                    highlightPosition={aboutContent.heading.highlightPosition}
                    description={aboutContent.heading.description}
                />

                {/* Main Content */}
                <div className="about-content">

                    {/* Image */}
                    <div className="about-image-wrap">
                        <Image
                            src={aboutContent.image.src}
                            alt={aboutContent.image.alt}
                            width={aboutContent.image.width}
                            height={aboutContent.image.height}
                            className="about-team-img"
                            priority
                        />
                    </div>

                    {/* Text Panel */}
                    <div className="about-text-wrap">
                        <div className="about-tilt-bg" aria-hidden="true" />
                        <div className="about-text-inner">
                            <h2 className="about-subtitle">
                                {aboutContent.subtitle}
                                <br />
                                <span>{aboutContent.subtitleHighlight}</span>
                            </h2>
                            <p
                                className="about-desc"
                                dangerouslySetInnerHTML={{ __html: aboutContent.description }}
                            />
                        </div>
                    </div>

                </div>

                {/* Stats */}
                <div className="about-stats" ref={statsRef}>
                    {STATS.map((stat) => (
                        <StatCard key={stat.card} stat={stat} animate={animate} />
                    ))}
                </div>

            </div>
        </section>
    );
}