"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import "./admin.css";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: "D" },
  { href: "/admin/judges", label: "Judges & Mentors", icon: "J" },
  { href: "/admin/teams", label: "Teams", icon: "T" },
  { href: "/admin/rounds", label: "Rounds", icon: "R" },
  { href: "/admin/leaderboard", label: "Leaderboard", icon: "L" },
  { href: "/admin/leaderboard-normalized", label: "Normalized Board", icon: "N" },
  { href: "/admin/leaderboard-normalized/method", label: "Method", icon: "M" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (pathname === "/admin/auth") {
    return <>{children}</>;
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/auth");
  }

  return (
    <div className="admin-layout">
      <button
        className="admin-mobile-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? "X" : "="}
      </button>

      <aside
        className={
          "admin-sidebar" + (sidebarOpen ? " admin-sidebar-open" : "")
        }
      >
        <div className="admin-sidebar-header">
          <div className="admin-sidebar-title">HackMol 7.0</div>
          <div className="admin-sidebar-subtitle">Admin Panel</div>
        </div>

        <nav className="admin-sidebar-nav">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  "admin-nav-link" +
                  (isActive ? " admin-nav-link-active" : "")
                }
                onClick={() => setSidebarOpen(false)}
              >
                <span className="admin-nav-icon">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="admin-sidebar-footer">
          <button className="admin-logout-btn" onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      </aside>

      <main className="admin-content">{children}</main>
    </div>
  );
}
