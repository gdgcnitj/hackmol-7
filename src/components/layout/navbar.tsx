"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
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
                        src="/images/hackmol_logo.png" 
                        alt="HackMol" 
                        width={120} 
                        height={40}
                        style={{ height: 'auto' }}
                    />
                </Link>
            </div>
            <div className="nav-links">
                <a href="#about">About</a>
                <a href="#tracks">Tracks</a>
                <a href="#timeline">Timeline</a>
                <a href="#sponsors">Sponsors</a>
                <a href="#faq">FAQ</a>
            </div>
            <div className="register-btn-wrapper">
                <button 
                    className="register-btn"
                    onClick={() => window.open('https://hackmol-7.devfolio.co', '_blank')}
                >
                    <Image 
                        src="/images/right-corner.png" 
                        alt="" 
                        width={30} 
                        height={30}
                        className="ornament ornament-top-left"
                    />
                    <Image 
                        src="/images/right-corner.png" 
                        alt="" 
                        width={30} 
                        height={30}
                        className="ornament ornament-top-right"
                    />
                    <Image 
                        src="/images/right-corner.png" 
                        alt="" 
                        width={30} 
                        height={30}
                        className="ornament ornament-bottom-left"
                    />
                    <Image 
                        src="/images/right-corner.png" 
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
