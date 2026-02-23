"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";
import "./about.css";

/* ─── Stat data ─────────────────────────────────────────────────────────── */
interface StatItem {
    end: number;
    suffix: string;
    label: string;
    card: "card-1" | "card-2" | "card-3" | "card-4";
}

const STATS: StatItem[] = [
    { end: 17437, suffix: "+", label: "Participants",       card: "card-1" },
    { end: 413,   suffix: "+", label: "Projects Submitted", card: "card-2" },
    { end: 100,   suffix: "+", label: "Sponsors",           card: "card-3" },
    { end: 30,    suffix: "+", label: "Hours of Hacking",   card: "card-4" },
];

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
                    title="ABOUT HACKMOL"
                    highlight="7.0"
                    highlightPosition="after"
                    description="Descend into 30 hours of creation. NIT Jalandhar's flagship hackathon, where builders forge the future."
                />

                {/* Main Content */}
                <div className="about-content">

                    {/* Image */}
                    <div className="about-image-wrap">
                        <Image
                            src="/images/team.png"
                            alt="HackMol Team at NIT Jalandhar"
                            width={500}
                            height={350}
                            className="about-team-img"
                            priority
                        />
                    </div>

                    {/* Text Panel */}
                    <div className="about-text-wrap">
                        <div className="about-tilt-bg" aria-hidden="true" />
                        <div className="about-text-inner">
                            <h2 className="about-subtitle">
                                Code Like a God,
                                <br />
                                <span>Leave a Legacy!</span>
                            </h2>
                            <p className="about-desc">
                                The seventh edition of HackMol, organised by GDGC NIT Jalandhar,
                                is your battleground for innovation. This 30-hour hackathon unites
                                warriors of code — both seasoned champions and rising contenders —
                                to forge groundbreaking solutions across digital realms.
                                March 28–29, 2026. Descend into the depths of innovation,
                                discover new possibilities, and develop real-world solutions
                                that leave a lasting impact.
                            </p>
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