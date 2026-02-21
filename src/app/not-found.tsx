"use client";

import Image from "next/image";
import Link from "next/link";
import { Cinzel } from "next/font/google";
import { useEffect } from "react";
import "./not-found.css";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export default function NotFound() {
  useEffect(() => {
    // Hide navbar and footer on mount
    const navbar = document.querySelector('.navbar') as HTMLElement;
    const footer = document.querySelector('footer') as HTMLElement;
    const main = document.querySelector('main') as HTMLElement;
    const body = document.body;
    
    if (navbar) navbar.style.display = 'none';
    if (footer) footer.style.display = 'none';
    if (main) {
      main.style.padding = '0';
      main.style.margin = '0';
    }
    body.style.background = '#080E1C';
    
    // Cleanup function to restore on unmount
    return () => {
      if (navbar) navbar.style.display = '';
      if (footer) footer.style.display = '';
      if (main) {
        main.style.padding = '';
        main.style.margin = '';
      }
      body.style.background = '';
    };
  }, []);

  return (
    <div className={`${cinzel.className} not-found-container`}>
      <div className="not-found-content">
        <div className="not-found-character">
          <Image
            src="/images/timelinePureVessel.png"
            alt="Pure Vessel - Lost in Hallownest"
            width={400}
            height={400}
            priority
            className="not-found-vessel"
          />
        </div>
        
        <div className="not-found-text">
          <h1 className="not-found-title">
            <span className="not-found-404">404</span>
          </h1>
          <h2 className="not-found-subtitle">Lost in the Void</h2>
          <p className="not-found-description">
            The path you seek has been consumed by the Radiance. 
            Even the Pure Vessel cannot guide you here.
          </p>
          
          <div className="not-found-actions">
            <Link href="/" className="not-found-button navbar-style">
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
              <span className="btn-text">Return to Dirtmouth</span>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="not-found-bg-effects">
        <div className="void-particle"></div>
        <div className="void-particle"></div>
        <div className="void-particle"></div>
      </div>
    </div>
  );
}