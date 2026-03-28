"use client";

import { useEffect, useState } from "react";

interface LeaderboardEntry {
  teamId: string;
  teamNumber: string;
  teamName: string;
  leaderName: string;
  isAllGirls: boolean;
  finalScore: number;
  roundDetails: Record<string, number>;
}

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadLeaderboard() {
    const res = await fetch("/api/admin/leaderboard");
    const data = await res.json();
    setEntries(data);
    setLoading(false);
  }

  useEffect(() => {
    void loadLeaderboard();
  }, []);

  async function exportCSV() {
    const res = await fetch("/api/admin/leaderboard?format=csv");
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "hackmol7-leaderboard.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  if (loading) {
    return (
      <div>
        <h1 className="admin-page-title">Leaderboard</h1>
        <p style={{ color: "rgba(255,255,255,0.5)" }}>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 24,
        }}
      >
        <h1 className="admin-page-title" style={{ margin: 0 }}>
          Leaderboard
        </h1>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            className="admin-btn admin-btn-primary"
            onClick={loadLeaderboard}
          >
            Refresh
          </button>
          <button className="admin-btn admin-btn-primary" onClick={exportCSV}>
            Export CSV
          </button>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Team No.</th>
                <th>Team Name</th>
                <th>Leader</th>
                <th>Mentor R1 (20%)</th>
                <th>Mentor R2 (20%)</th>
                <th>Judging (60%)</th>
                <th>Final Score</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, i) => (
                <tr key={entry.teamId}>
                  <td
                    style={{
                      fontFamily: "var(--font-cinzel), serif",
                      color: i < 3 ? "#4da8da" : undefined,
                      fontWeight: i < 3 ? 700 : undefined,
                    }}
                  >
                    {i + 1}
                  </td>
                  <td>{entry.teamNumber}</td>
                  <td>
                    {entry.teamName}
                    {entry.isAllGirls && (
                      <span
                        className="admin-badge"
                        style={{
                          marginLeft: 8,
                          background: "rgba(236, 72, 153, 0.18)",
                          borderColor: "rgba(236, 72, 153, 0.45)",
                          color: "#f9a8d4",
                        }}
                      >
                        All Girls Team
                      </span>
                    )}
                  </td>
                  <td>{entry.leaderName}</td>
                  <td>{(entry.roundDetails.MENTOR_1 ?? 0).toFixed(1)}</td>
                  <td>{(entry.roundDetails.MENTOR_2 ?? 0).toFixed(1)}</td>
                  <td>{(entry.roundDetails.JUDGING ?? 0).toFixed(1)}</td>
                  <td
                    style={{
                      fontFamily: "var(--font-cinzel), serif",
                      color: "#4da8da",
                      fontWeight: 700,
                    }}
                  >
                    {entry.finalScore.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
