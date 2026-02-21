"use client";

import Image from "next/image";
import { useEffect } from "react";
import "./about.css";

export default function About() {

    useEffect(() => {
        const container = document.getElementById("about-particles");
        if (!container) return;

        const particleCount = 60;

        for (let i = 0; i < particleCount; i++) {
            const p = document.createElement("div");
            p.className = "about-particle";

            // Random position
            p.style.left = Math.random() * 100 + "%";
            p.style.top = Math.random() * 100 + "%";

            // Random animation delay
            p.style.animationDelay = Math.random() * 6 + "s";

            container.appendChild(p);
        }

        return () => {
            container.innerHTML = "";
        };
    }, []);


    return (
        <section className="about-section" id="about">

            {/* Particles */}
            <div className="about-particles" id="about-particles"></div>

            <div className="container">

                {/* Title */}
                <div className="title-section">
                    <h1 className="main-title">
                        ABOUT HACKMOL <span className="version">7.0</span>
                    </h1>

                    <div className="title-underline"></div>
                </div>

                {/* Main Content */}
                <div className="content-section">

                    {/* Image */}
                    <div className="image-container">
                        <Image
                            src="/images/team.png"
                            alt="HackMol Team"
                            width={500}
                            height={350}
                            className="team-image"
                        />
                    </div>

                    {/* Text */}
                    <div className="text-container">

                        <div className="tilt-background"></div>

                        <div className="text-content">

                            <h2 className="subtitle">
                                Code Like a God,
                                <br /><span>
                                    Leave a Legacy!
                                </span>
                            </h2>

                            <p className="description">
                                The seventh edition of HackMol, organised by GDGC NIT Jalandhar,
                                is your battleground for innovation. This 30-hour hackathon unites
                                warriors of code—both seasoned champions and rising contenders—
                                to forge groundbreaking solutions across digital realms. March 28-29, 2026.
                                Descend into the depths of innovation, discover new possibilities,
                                and develop real-world solutions that leave a lasting impact.
                            </p>

                        </div>

                    </div>

                </div>

                {/* Stats */}
                <div className="stats-section">

                    <div className="stat-card card-1">
                        <div className="stat-number">200+</div>
                        <div className="stat-label">Projects Submitted</div>
                    </div>

                    <div className="stat-card card-2">
                        <div className="stat-number">200+</div>
                        <div className="stat-label">Projects Submitted</div>
                    </div>

                    <div className="stat-card card-3">
                        <div className="stat-number">200+</div>
                        <div className="stat-label">Projects Submitted</div>
                    </div>

                    <div className="stat-card card-4">
                        <div className="stat-number">200+</div>
                        <div className="stat-label">Projects Submitted</div>
                    </div>

                </div>

            </div>

        </section>
    );
}