"use client";

import Link from "next/link";
import Image from "next/image";
import "./Navbar.css";

export default function Navbar() {
    return (
        <nav className="navbar">
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
            <div>
                <button className="register-btn">Register</button>
            </div>
        </nav>
    )
}
