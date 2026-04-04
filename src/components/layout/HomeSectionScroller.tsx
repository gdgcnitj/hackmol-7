"use client";

import { useEffect } from "react";

const NAVBAR_OFFSET = 88;

function scrollToSectionById(id: string) {
  const element = document.getElementById(id);
  if (!element) return false;

  const top = element.getBoundingClientRect().top + window.scrollY - NAVBAR_OFFSET;
  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  window.history.replaceState(null, "", `/#${id}`);
  return true;
}

export default function HomeSectionScroller() {
  useEffect(() => {
    let rafId = 0;

    const pendingId = sessionStorage.getItem("home-scroll-target");
    const hashId = window.location.hash.replace("#", "");
    const targetId = pendingId || hashId;

    if (!targetId) return;

    let retries = 0;
    const maxRetries = 20;

    const tryScroll = () => {
      const didScroll = scrollToSectionById(targetId);
      if (didScroll) {
        sessionStorage.removeItem("home-scroll-target");
        return;
      }

      retries += 1;
      if (retries <= maxRetries) {
        rafId = window.requestAnimationFrame(tryScroll);
      }
    };

    rafId = window.requestAnimationFrame(tryScroll);

    return () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, []);

  useEffect(() => {
    const onHashChange = () => {
      const id = window.location.hash.replace("#", "");
      if (!id) return;
      scrollToSectionById(id);
    };

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return null;
}
