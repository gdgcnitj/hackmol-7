"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./hero.css";

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 138;

function getCurrentFrame(index: number): string {
  return `/frames/${String(index + 1).padStart(3, "0")}.png`;
}

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const frameIndexRef = useRef({ value: 0 });
  const lastRenderedFrame = useRef(-1);
  const framesRef = useRef<(ImageBitmap | null)[]>(new Array(FRAME_COUNT).fill(null));
  
  // Countdown state
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Countdown timer
  useEffect(() => {
    const targetDate = new Date('2026-03-28T08:00:00').getTime();
    
    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Load Devfolio SDK
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://apply.devfolio.co/v2/sdk.js';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    const context = canvas.getContext("2d", { alpha: false });
    if (!context) return;

    // Use medium quality for better performance during animation
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "medium";

    // 1. Optimize Canvas Size (Retina/4K killing performance -> cap at dpr=1 for background)
    const setCanvasSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    // Render frame function (defined BEFORE use)
    const renderFrame = (index: number) => {
      if (!context || !canvas) return;

      const safeIndex = Math.max(0, Math.min(FRAME_COUNT - 1, Math.round(index)));

      // Skip redundant renders
      if (safeIndex === lastRenderedFrame.current) return;
      lastRenderedFrame.current = safeIndex;

      const bitmap = framesRef.current[safeIndex];
      // If frame not ready, do nothing (wait for load)
      if (!bitmap) return;

      const displayW = canvas.width;
      const displayH = canvas.height;

      context.clearRect(0, 0, displayW, displayH);

      // Draw covering canvas (contain logic)
      const canvasRatio = displayW / displayH;
      const imgRatio = bitmap.width / bitmap.height;

      let drawW, drawH, offsetX, offsetY;

      if (imgRatio > canvasRatio) {
        drawH = displayH;
        drawW = drawH * imgRatio;
        offsetX = (displayW - drawW) / 2;
        offsetY = 0;
      } else {
        drawW = displayW;
        drawH = drawW / imgRatio;
        offsetX = 0;
        offsetY = (displayH - drawH) / 2;
      }

      context.drawImage(bitmap, offsetX, offsetY, drawW, drawH);
    };

    // 2. Efficient Frame Loading (Batching to avoid network/thread congestion)
    const loadFrame = async (index: number) => {
      if (framesRef.current[index]) return; // Already loaded

      try {
        const src = getCurrentFrame(index);
        const resp = await fetch(src);
        const blob = await resp.blob();
        // createImageBitmap decodes off-main-thread. Huge win.
        const bitmap = await createImageBitmap(blob);
        framesRef.current[index] = bitmap;
      } catch (err) {
        console.error(`Failed to load frame ${index}`, err);
      }
    };

    // Initial setup - set canvas size FIRST
    setCanvasSize();
    
    // Fill with background color initially
    context.fillStyle = '#080E1C'; // Match the midnight background
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Continuous Render Loop
    let rafId: number;
    const tick = () => {
      renderFrame(frameIndexRef.current.value);
      rafId = requestAnimationFrame(tick);
    };

    // Load initial batch (priority)
    const PRELOAD_BATCH = 25; // Adjusted batch size
    (async () => {
      // Load first frame immediately and render it
      await loadFrame(0);
      renderFrame(0);
      
      // Start render loop after first frame is ready
      rafId = requestAnimationFrame(tick);
      
      const loadPromises = [];
      for (let i = 1; i < FRAME_COUNT; i++) {
        // High priority: first batch
        if (i < PRELOAD_BATCH) {
          loadPromises.push(loadFrame(i));
        } else {
          // Add a tiny delay between subsequent batches to yield to UI
          // Using 20ms delay to keep the main thread breathing space
          await new Promise(r => setTimeout(r, 20));
          loadFrame(i);
        }
      }
      // Wait for first batch to be ready
      await Promise.all(loadPromises.slice(0, PRELOAD_BATCH - 1));
    })();

    const handleResize = () => {
      setCanvasSize();
      lastRenderedFrame.current = -1; // Force redraw
    };

    // Initial setup
    setCanvasSize();
    window.addEventListener("resize", handleResize);

    // ScrollTrigger
    const scrollAnimation = gsap.to(frameIndexRef.current, {
      value: FRAME_COUNT - 1,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        pin: ".hero-canvas-wrapper",
        scrub: 0.5, // Keeps it responsive
      },
    });

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(rafId);
      scrollAnimation.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());

      // Cleanup bitmaps to free GPU memory
      framesRef.current.forEach(bmp => bmp?.close());
    };
  }, []);

  return (
    <>
      {/* Background Effects */}
      <div className="background-container">
        <div className="radial-glow"></div>
      </div>

      {/* Hero Section with scroll-driven frames */}
      <section className="hero-scroll-section" ref={sectionRef}>
        <div className="hero-canvas-wrapper">
          {/* Logo OVERLAY */}
          <div className="logo-overlay">
            <Image
              src="/images/hackmol_logo.png"
              alt="HackMol 7.0"
              width={1000}
              height={300}
              className="logo-ornament"
              priority
            />
            {/* Tagline */}
            <div className="hero-tagline">
              Descend. Discover. Develop.
            </div>
          </div>

          {/* Countdown Timer */}
          <div className="countdown-overlay">
            <div className="countdown-label">Registration Ends In</div>
            <div className="countdown-timer">
              <div className="countdown-item">
                <span className="countdown-value">{timeLeft.days}</span>
                <span className="countdown-unit">Days</span>
              </div>
              <div className="countdown-separator">:</div>
              <div className="countdown-item">
                <span className="countdown-value">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="countdown-unit">Hours</span>
              </div>
              <div className="countdown-separator">:</div>
              <div className="countdown-item">
                <span className="countdown-value">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="countdown-unit">Minutes</span>
              </div>
              <div className="countdown-separator">:</div>
              <div className="countdown-item">
                <span className="countdown-value">{String(timeLeft.seconds).padStart(2, '0')}</span>
                <span className="countdown-unit">Seconds</span>
              </div>
            </div>
          </div>

          {/* Devfolio Apply Button */}
          <div className="devfolio-button-overlay">
            <div 
              className="apply-button" 
              data-hackathon-slug="hackmol-7" 
              data-button-theme="dark"
              style={{ height: '44px', width: '312px' }}
            ></div>
          </div>

          {/* Canvas for frame animation */}
          <canvas ref={canvasRef} className="hero-canvas" />

          {/* Vignette & Texture Overlay */}
          <div className="vignette-overlay"></div>

          {/* Scroll indicator */}
          <div className="scroll-indicator">
            <Image
              src="/images/scroll_down.png"
              alt="Scroll Down"
              width={30}
              height={30}
              className="scroll-arrow"
            />
          </div>
        </div>
      </section>
    </>
  );
}
