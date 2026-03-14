"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { navLinks } from "@/data/navigation";
import { siteConfig } from "@/data/site";
import "./Navbar.css";

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState<string>("");

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const sectionIds = navLinks
            .map((l) => l.href.replace("#", ""))
            .filter(Boolean);

        const observers: IntersectionObserver[] = [];
        const visibleSections = new Map<string, number>();

        sectionIds.forEach((id) => {
            const el = document.getElementById(id);
            if (!el) return;

            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        visibleSections.set(id, entry.intersectionRatio);
                    } else {
                        visibleSections.delete(id);
                    }
                    if (visibleSections.size > 0) {
                        const best = [...visibleSections.entries()].reduce((a, b) =>
                            a[1] >= b[1] ? a : b
                        );
                        setActiveSection(best[0]);
                    }
                },
                { threshold: [0, 0.2, 0.5, 0.8, 1], rootMargin: "-60px 0px -20% 0px" }
            );

            observer.observe(el);
            observers.push(observer);
        });

        return () => observers.forEach((o) => o.disconnect());
    }, []);

    return (
        <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
            <div className="nav-logo">
                <Link href="/">
                    <Image 
                        src="/assets/branding/hackmol_logo.png" 
                        alt="HackMol" 
                        width={120} 
                        height={40}
                        style={{ height: 'auto' }}
                    />
                </Link>
            </div>
            <div className="nav-links">
                {navLinks.map((link) => {
                    const sectionId = link.href.replace("#", "");
                    const isActive = activeSection === sectionId;
                    return (
                        <a
                            key={link.href}
                            href={link.href}
                            className={isActive ? "active" : ""}
                        >
                            {link.label}
                        </a>
                    );
                })}
            </div>
            <div className="register-btn-wrapper">
                <button 
                    className="register-btn"
                    onClick={() => window.open(siteConfig.devfolioUrl, '_blank')}
                >
                    <Image 
                        src="/assets/decorative/right-corner.png" 
                        alt="" 
                        width={30} 
                        height={30}
                        className="ornament ornament-top-left"
                    />
                    <Image 
                        src="/assets/decorative/right-corner.png" 
                        alt="" 
                        width={30} 
                        height={30}
                        className="ornament ornament-top-right"
                    />
                    <Image 
                        src="/assets/decorative/right-corner.png" 
                        alt="" 
                        width={30} 
                        height={30}
                        className="ornament ornament-bottom-left"
                    />
                    <Image 
                        src="/assets/decorative/right-corner.png" 
                        alt="" 
                        width={30} 
                        height={30}
                        className="ornament ornament-bottom-right"
                    />
                    <span className="btn-text">Register</span>
                </button>
            </div>
        </nav>
    )
}
