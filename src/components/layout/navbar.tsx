"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { navLinks } from "@/data/navigation";
import { siteConfig } from "@/data/site";
import "./Navbar.css";

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
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
                {navLinks.map((link) => (
                    <a key={link.href} href={link.href}>{link.label}</a>
                ))}
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
