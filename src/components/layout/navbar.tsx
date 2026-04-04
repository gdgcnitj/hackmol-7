"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { navLinks } from "@/data/navigation";
import { siteConfig } from "@/data/site";
import "./Navbar.css";

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState<string>("");
    const pathname = usePathname();
    const router = useRouter();

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (!element) return;

        const y = element.getBoundingClientRect().top + window.scrollY - 88;
        window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
        window.history.replaceState(null, "", `/#${sectionId}`);
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const sectionIds = navLinks
            .filter((l) => l.href.startsWith("#"))
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
                    const isRouteLink = link.href.startsWith("/");
                    const sectionId = link.href.replace("#", "");
                    const targetHref = isRouteLink
                        ? link.href
                        : pathname === "/"
                            ? link.href
                            : `/${link.href}`;
                    const isActive = isRouteLink
                        ? pathname === link.href
                        : pathname === "/" && activeSection === sectionId;

                    return (
                        <Link
                            key={link.href}
                            href={targetHref}
                            className={isActive ? "active" : ""}
                            onClick={(event) => {
                                if (!link.href.startsWith("#")) return;

                                const isModifiedClick =
                                    event.metaKey ||
                                    event.ctrlKey ||
                                    event.shiftKey ||
                                    event.altKey ||
                                    event.button !== 0;

                                if (isModifiedClick) return;

                                const id = link.href.slice(1);
                                if (!id) return;

                                event.preventDefault();

                                if (pathname === "/") {
                                    scrollToSection(id);
                                    return;
                                }

                                sessionStorage.setItem("home-scroll-target", id);
                                router.push("/");
                            }}
                        >
                            {link.label}
                        </Link>
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
