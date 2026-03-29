"use client";

import { useEffect, useState } from "react";

interface EvaluationBreakdown {
  evaluatorRole: string;
  evaluatorLabel: string;
  evaluatorName: string;
  technical: number;
  innovation: number;
  impact: number;
  demo: number;
  presentation: number;
  weightedTotal: number;
}

interface LeaderboardEntry {
  teamId: string;
  teamNumber: string;
  teamName: string;
  leaderName: string;
  isAllGirls: boolean;
  finalScore: number;
  roundDetails: Record<string, number>;
  roundBreakdown: Record<string, EvaluationBreakdown[]>;
}

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [breakdownModal, setBreakdownModal] = useState<{
    teamName: string;
    teamNumber: string;
    roundBreakdown: Record<string, EvaluationBreakdown[]>;
  } | null>(null);

  function openBreakdown(entry: LeaderboardEntry) {
    setBreakdownModal({
      teamName: entry.teamName,
      teamNumber: entry.teamNumber,
      roundBreakdown: entry.roundBreakdown ?? {},
    });
  }

  function getCombinedRows(roundBreakdown: Record<string, EvaluationBreakdown[]>) {
    const roundConfig = [
      { key: "MENTOR_1", label: "Mentor Round 1" },
      { key: "MENTOR_2", label: "Mentor Round 2" },
      { key: "JUDGING", label: "Judging Round" },
    ];

    return roundConfig.flatMap(({ key, label }) => {
      const evaluations = roundBreakdown[key] ?? [];
      return evaluations.map((evaluation, index) => ({
        rowKey: `${key}-${evaluation.evaluatorName}-${index}`,
        round: label,
        ...evaluation,
      }));
    });
  }

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
                <tr
                  key={entry.teamId}
                  onClick={() => openBreakdown(entry)}
                  style={{ cursor: "pointer" }}
                  title="Click to view marks breakdown"
                >
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

      {breakdownModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 16,
            zIndex: 1000,
          }}
          onClick={() => setBreakdownModal(null)}
        >
          <div
            className="admin-card"
            style={{
              width: "min(920px, 100%)",
              maxHeight: "80vh",
              overflow: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 8,
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-cinzel), serif",
                  color: "#ffffff",
                  fontSize: 16,
                }}
              >
                {breakdownModal.teamNumber} - {breakdownModal.teamName} (Marks Breakdown)
              </div>
              <button
                className="admin-btn admin-btn-danger admin-btn-small"
                onClick={() => setBreakdownModal(null)}
              >
                Close
              </button>
            </div>

            {getCombinedRows(breakdownModal.roundBreakdown).length === 0 ? (
              <p style={{ color: "rgba(255,255,255,0.6)", margin: 0 }}>
                No evaluations submitted for this team yet.
              </p>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Round</th>
                      <th>Name</th>
                      <th>Technical</th>
                      <th>Innovation</th>
                      <th>Impact</th>
                      <th>Demo</th>
                      <th>Presentation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getCombinedRows(breakdownModal.roundBreakdown).map((row) => (
                      <tr key={row.rowKey}>
                        <td>{row.round}</td>
                        <td>{row.evaluatorName}</td>
                        <td>{row.technical}</td>
                        <td>{row.innovation}</td>
                        <td>{row.impact}</td>
                        <td>{row.demo}</td>
                        <td>{row.presentation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
