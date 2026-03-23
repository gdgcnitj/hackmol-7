import type { HeroConfig } from "@/types";
import { siteConfig } from "@/data/site";

export const heroConfig: HeroConfig = {
  frameCount: 46,
  minFramesForScroll: 40,
  concurrentLoadLimit: 6,
  countdownTarget: siteConfig.dates.registrationClose,
  ctaLabel: "Register Now",
};
