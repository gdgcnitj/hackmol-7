"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import "./judge.css";

export default function JudgeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    function handleFsChange() {
      setIsFullscreen(!!document.fullscreenElement);
    }
    document.addEventListener("fullscreenchange", handleFsChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/auth");
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }

  return (
    <div className="judge-layout">
      <header className="judge-header">
        <div className="judge-header-left">
          <div className="judge-header-title">HackMol 7.0</div>
        </div>
        <div className="judge-header-right">
          <button
            className="judge-fullscreen-btn"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          </button>
          <button className="judge-logout-btn" onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      </header>
      <main className="judge-content">{children}</main>
    </div>
  );
}
