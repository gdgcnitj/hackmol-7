"use client";

import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";
import "./about.css";

export default function About() {

    return (
        <section className="about-section" id="about">

            <div className="container">

                {/* Title */}
                <SectionHeading
                    title="ABOUT HACKMOL"
                    highlight="7.0"
                    highlightPosition="after"
                    description="Descend into 30 hours of creation. NIT Jalandhar's flagship hackathon — where builders forge the future."
                />

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