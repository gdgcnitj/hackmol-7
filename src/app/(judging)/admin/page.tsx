"use client";

import { useEffect, useState } from "react";

interface Stats {
  teams: number;
  judges: number;
  mentors: number;
  scores: number;
  activeRound: string | null;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    async function load() {
      const [teamsRes, judgesRes, roundsRes] = await Promise.all([
        fetch("/api/admin/teams"),
        fetch("/api/admin/judges"),
        fetch("/api/admin/rounds"),
      ]);

      const teams = await teamsRes.json();
      const judges = await judgesRes.json();
      const rounds = await roundsRes.json();

      const totalScores = teams.reduce(
        (acc: number, t: { scores: unknown[] }) => acc + t.scores.length,
        0
      );

      const activeRound = rounds.find(
        (r: { isActive: boolean; name: string }) => r.isActive
      );

      setStats({
        teams: teams.length,
        judges: judges.filter(
          (j: { role: string }) => j.role === "JUDGE"
        ).length,
        mentors: judges.filter(
          (j: { role: string }) => j.role === "MENTOR"
        ).length,
        scores: totalScores,
        activeRound: activeRound ? activeRound.name : null,
      });
    }
    load();
  }, []);

  if (!stats) {
    return (
      <div>
        <h1 className="admin-page-title">Dashboard</h1>
        <p style={{ color: "rgba(255,255,255,0.5)" }}>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="admin-page-title">Dashboard</h1>

      <div className="admin-stats-grid">
        <div className="admin-card">
          <div className="admin-card-title">Teams</div>
          <div className="admin-card-value">{stats.teams}</div>
        </div>
        <div className="admin-card">
          <div className="admin-card-title">Judges</div>
          <div className="admin-card-value">{stats.judges}</div>
        </div>
        <div className="admin-card">
          <div className="admin-card-title">Mentors</div>
          <div className="admin-card-value">{stats.mentors}</div>
        </div>
        <div className="admin-card">
          <div className="admin-card-title">Scores Submitted</div>
          <div className="admin-card-value">{stats.scores}</div>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-title">Active Round</div>
        <div
          className="admin-card-value"
          style={{ fontSize: "clamp(18px, 2vw, 24px)" }}
        >
          {stats.activeRound || "No round active"}
        </div>
      </div>
    </div>
  );
}
