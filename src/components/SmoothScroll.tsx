"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll() {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.8,
            easing: (t: number) => 1 - Math.pow(1 - t, 4), // Quartic ease-out — very smooth deceleration
            smoothWheel: true,
            wheelMultiplier: 0.8, // Reduce wheel speed for finer control
            touchMultiplier: 1.5,
        });

        // Connect Lenis to GSAP ScrollTrigger
        lenis.on("scroll", ScrollTrigger.update);

        const rafCallback = (time: number) => {
            lenis.raf(time * 1000);
        };

        gsap.ticker.add(rafCallback);
        gsap.ticker.lagSmoothing(0);

        return () => {
            gsap.ticker.remove(rafCallback);
            lenis.destroy();
        };
    }, []);

    return null;
}
