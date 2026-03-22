"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HiChevronDown } from "react-icons/hi2";
import { heroConfig } from "@/data/hero";
import { sponsors } from "@/data/sponsors";
import "./hero.css";

gsap.registerPlugin(ScrollTrigger);

const { frameCount: FRAME_COUNT, minFramesForScroll: MIN_FRAMES_FOR_SCROLL, concurrentLoadLimit: CONCURRENT_LOAD_LIMIT } = heroConfig;
const heroSponsors = sponsors.map(({ name, logo, url }) => ({ name, logo, url }));

function getCurrentFrame(index: number): string {
  return `/frames/${String(index + 1).padStart(3, "0")}.webp`;
}

/**
 * Generate a smart loading order:
 * 1. Frame 0 (immediate display)
 * 2. Key frames evenly spread across the sequence (skeleton preview)
 * 3. Fill in remaining frames sequentially
 */
function getSmartLoadOrder(): number[] {
  const order: number[] = [0];
  const visited = new Set<number>([0]);

  // Phase 1: Key frames — every ~10th frame for quick scrub preview
  for (let i = 10; i < FRAME_COUNT; i += 10) {
    if (!visited.has(i)) {
      order.push(i);
      visited.add(i);
    }
  }
  // Include last frame
  if (!visited.has(FRAME_COUNT - 1)) {
    order.push(FRAME_COUNT - 1);
    visited.add(FRAME_COUNT - 1);
  }

  // Phase 2: Interleave — every 5th frame
  for (let i = 5; i < FRAME_COUNT; i += 5) {
    if (!visited.has(i)) {
      order.push(i);
      visited.add(i);
    }
  }

  // Phase 3: Fill remaining sequentially
  for (let i = 0; i < FRAME_COUNT; i++) {
    if (!visited.has(i)) {
      order.push(i);
      visited.add(i);
    }
  }

  return order;
}

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const frameIndexRef = useRef({ value: 0 });
  const lastRenderedFrame = useRef(-1);
  const framesRef = useRef<(ImageBitmap | null)[]>(new Array(FRAME_COUNT).fill(null));
  const loadedCountRef = useRef(0);

  // Loading state
  const [loadProgress, setLoadProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Countdown state
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Countdown timer
  useEffect(() => {
    const targetDate = new Date(heroConfig.countdownTarget).getTime();
    
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

  // Find nearest loaded frame (fallback when the exact frame isn't loaded yet)
  const findNearestLoadedFrame = useCallback((targetIndex: number): ImageBitmap | null => {
    const frames = framesRef.current;
    // Check exact frame first
    if (frames[targetIndex]) return frames[targetIndex];

    // Search outward from targetIndex in both directions
    for (let offset = 1; offset < FRAME_COUNT; offset++) {
      const before = targetIndex - offset;
      const after = targetIndex + offset;
      if (before >= 0 && frames[before]) return frames[before];
      if (after < FRAME_COUNT && frames[after]) return frames[after];
    }
    return null;
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

    // Draw a bitmap onto the canvas with cover scaling
    const drawBitmap = (bitmap: ImageBitmap) => {
      const displayW = canvas.width;
      const displayH = canvas.height;

      context.clearRect(0, 0, displayW, displayH);

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

    // Render frame function with nearest-frame fallback
    const renderFrame = (index: number) => {
      if (!context || !canvas) return;

      const safeIndex = Math.max(0, Math.min(FRAME_COUNT - 1, Math.round(index)));

      // Skip redundant renders
      if (safeIndex === lastRenderedFrame.current) return;

      // Try exact frame, fallback to nearest loaded frame
      const bitmap = framesRef.current[safeIndex] || findNearestLoadedFrame(safeIndex);
      if (!bitmap) return;

      lastRenderedFrame.current = safeIndex;
      drawBitmap(bitmap);
    };

    // 2. Efficient Frame Loading with concurrency control
    let cancelled = false;

    const loadFrame = async (index: number): Promise<void> => {
      if (cancelled) return;
      if (framesRef.current[index]) return; // Already loaded

      try {
        const src = getCurrentFrame(index);
        const resp = await fetch(src);
        if (cancelled) return;
        const blob = await resp.blob();
        if (cancelled) return;
        // createImageBitmap decodes off-main-thread. Huge win.
        const bitmap = await createImageBitmap(blob);
        if (cancelled) return;
        framesRef.current[index] = bitmap;

        // Track progress
        loadedCountRef.current++;
        const progress = Math.round((loadedCountRef.current / FRAME_COUNT) * 100);
        setLoadProgress(progress);

        // Mark as ready for scroll once we have enough key frames
        if (loadedCountRef.current >= MIN_FRAMES_FOR_SCROLL) {
          setIsLoaded(true);
        }
      } catch (err) {
        if (!cancelled) {
          console.error(`Failed to load frame ${index}`, err);
        }
      }
    };

    // Concurrency-limited batch loader
    const loadFramesWithConcurrency = async (indices: number[], concurrency: number) => {
      let cursor = 0;

      const worker = async () => {
        while (cursor < indices.length && !cancelled) {
          const idx = indices[cursor++];
          await loadFrame(idx);
        }
      };

      const workers = Array.from({ length: concurrency }, () => worker());
      await Promise.all(workers);
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

    // Smart loading: prioritize key frames first, then fill in
    const loadOrder = getSmartLoadOrder();

    (async () => {
      // Load first frame immediately and render it
      await loadFrame(0);
      if (cancelled) return;
      renderFrame(0);
      
      // Start render loop after first frame is ready
      rafId = requestAnimationFrame(tick);

      // Load remaining frames in smart order with concurrency limit
      const remaining = loadOrder.slice(1); // Skip frame 0 (already loaded)
      await loadFramesWithConcurrency(remaining, CONCURRENT_LOAD_LIMIT);
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

    // Copy ref so the cleanup function captures the current value
    const frames = framesRef.current;

    return () => {
      cancelled = true;
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(rafId);
      scrollAnimation.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());

      // Cleanup bitmaps to free GPU memory
      frames.forEach(bmp => bmp?.close());
    };
  }, [findNearestLoadedFrame]);

  return (
    <>
      {/* Loading overlay — shown until enough frames are loaded */}
      <div className={`hero-loading-overlay ${isLoaded ? "hero-loading-hidden" : ""}`}>
        <div className="hero-loading-content">
          <Image
            src="/assets/branding/hackmol_logo.png"
            alt="HackMol 7.0"
            width={600}
            height={180}
            className="hero-loading-logo"
            priority
          />
          <div className="hero-loading-bar-track">
            <div
              className="hero-loading-bar-fill"
              style={{ width: `${loadProgress}%` }}
            />
          </div>
          <p className="hero-loading-text">
            Loading… {loadProgress}%
          </p>
        </div>
      </div>

      {/* Hero Section with scroll-driven frames */}
      <section className="hero-scroll-section" ref={sectionRef}>
        <div className="hero-canvas-wrapper">
          {/* Atmospheric backdrop — soft dark gradient behind content zone */}
          <div className="hero-content-backdrop"></div>

          <div className="hero-stack">
            {/* Logo OVERLAY */}
            <div className="logo-overlay">
              <Image
                src="/assets/branding/hackmol_logo.png"
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

            {/* Live Status */}
            <div className="hero-live-overlay" aria-label="Live updates">
              <div className="hero-live-items">
                <div className="hero-live-item">
                  <span className="hero-live-item-dot" aria-hidden="true"></span>
                  <span className="hero-live-item-text">PPT Submission is Live</span>
                </div>
                <div className="hero-live-item">
                  <span className="hero-live-item-dot" aria-hidden="true"></span>
                  <span className="hero-live-item-text">Registration is Live</span>
                </div>
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

            {/* Moving info bulletin */}
            <div className="hero-bulletin-overlay" aria-label="Important announcements">
              <div className="hero-bulletin-shell">
                <div className="hero-bulletin-badge">Latest Updates</div>
                <div className="hero-bulletin-marquee" role="marquee">
                  <div className="hero-bulletin-content">
                    <span className="hero-bulletin-item">PPT Submission Deadline 24 March 12 PM</span>
                    <span className="hero-bulletin-divider" aria-hidden="true">•</span>
                    <a
                      href="https://docs.google.com/spreadsheets/d/1bdVxhohD2NRDGQ20FES-2XSoB5q51s87PBjna9VGijs/edit?usp=sharing"
                      target="_blank"
                      rel="noreferrer"
                      className="hero-bulletin-item hero-bulletin-link"
                    >
                      Round 1 Result (Final Team Selected for Offline Round)
                    </a>
                    <span className="hero-bulletin-divider" aria-hidden="true">•</span>
                    <a
                      href="https://docs.google.com/presentation/d/1hSpe1LAQOVyALhz5Ne8MBoJGg2Aer3h6/edit?slide=id.p1#slide=id.p1"
                      target="_blank"
                      rel="noreferrer"
                      className="hero-bulletin-item hero-bulletin-link"
                    >
                      Download PPT Template
                    </a>
                    <span className="hero-bulletin-divider" aria-hidden="true">•</span>
                    <a
                      href="https://docs.google.com/forms/d/e/1FAIpQLSfc36KOpyJJjNHl0JwyGgPvdgAHDztu_uflMPFKIV9lhmx61w/viewform"
                      target="_blank"
                      rel="noreferrer"
                      className="hero-bulletin-item hero-bulletin-link"
                    >
                      Round 1 Submission
                    </a>
                    <span className="hero-bulletin-divider" aria-hidden="true">•</span>
                  </div>
                  <div className="hero-bulletin-content" aria-hidden="true">
                    <span className="hero-bulletin-item">PPT Submission Deadline 24 March 12 PM</span>
                    <span className="hero-bulletin-divider" aria-hidden="true">•</span>
                    <a
                      href="https://docs.google.com/spreadsheets/d/1bdVxhohD2NRDGQ20FES-2XSoB5q51s87PBjna9VGijs/edit?usp=sharing"
                      target="_blank"
                      rel="noreferrer"
                      className="hero-bulletin-item hero-bulletin-link"
                    >
                      Round 1 Result (Final Team Selected for Offline Round)
                    </a>
                    <span className="hero-bulletin-divider" aria-hidden="true">•</span>
                    <a
                      href="https://docs.google.com/presentation/d/1hSpe1LAQOVyALhz5Ne8MBoJGg2Aer3h6/edit?slide=id.p1#slide=id.p1"
                      target="_blank"
                      rel="noreferrer"
                      className="hero-bulletin-item hero-bulletin-link"
                    >
                      Download PPT Template
                    </a>
                    <span className="hero-bulletin-divider" aria-hidden="true">•</span>
                    <a
                      href="https://docs.google.com/forms/d/e/1FAIpQLSfc36KOpyJJjNHl0JwyGgPvdgAHDztu_uflMPFKIV9lhmx61w/viewform"
                      target="_blank"
                      rel="noreferrer"
                      className="hero-bulletin-item hero-bulletin-link"
                    >
                      Round 1 Submission
                    </a>
                    <span className="hero-bulletin-divider" aria-hidden="true">•</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Moving sponsor logos */}
            <div className="hero-sponsors-overlay" aria-label="Sponsors">
              <div className="hero-sponsors-marquee">
                <div className="hero-sponsors-track">
                  {heroSponsors.map((sponsor) => (
                    <a
                      key={`sponsor-primary-${sponsor.name}`}
                      href={sponsor.url}
                      target="_blank"
                      rel="noreferrer"
                      className="hero-sponsor-item"
                      aria-label={sponsor.name}
                    >
                      <Image
                        src={sponsor.logo}
                        alt={sponsor.name}
                        width={120}
                        height={40}
                        className="hero-sponsor-logo"
                      />
                    </a>
                  ))}
                </div>
                <div className="hero-sponsors-track" aria-hidden="true">
                  {heroSponsors.map((sponsor) => (
                    <a
                      key={`sponsor-duplicate-${sponsor.name}`}
                      href={sponsor.url}
                      target="_blank"
                      rel="noreferrer"
                      className="hero-sponsor-item"
                      tabIndex={-1}
                    >
                      <Image
                        src={sponsor.logo}
                        alt=""
                        width={120}
                        height={40}
                        className="hero-sponsor-logo"
                      />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Canvas for frame animation */}
          <canvas ref={canvasRef} className="hero-canvas" />

          {/* Vignette & Texture Overlay */}
          <div className="vignette-overlay"></div>

          {/* Scroll indicator */}
          <div className="scroll-indicator">
            <HiChevronDown className="scroll-arrow" />
          </div>
        </div>
      </section>
    </>
  );
}
