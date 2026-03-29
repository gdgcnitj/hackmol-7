"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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
  normalizedWeightedTotal: number;
  evaluatorMean: number;
  evaluatorStdDev: number;
}

interface LeaderboardEntry {
  teamId: string;
  teamNumber: string;
  teamName: string;
  leaderName: string;
  isAllGirls: boolean;
  normalizedRank: number;
  rawRank: number;
  rankDelta: number;
  rawFinalScore: number;
  normalizedFinalScore: number;
  totalEvaluators: number;
  rawRoundDetails: Record<string, number>;
  normalizedRoundDetails: Record<string, number>;
  roundBreakdown: Record<string, EvaluationBreakdown[]>;
}

interface EvaluatorAnalytics {
  userId: string;
  evaluatorName: string;
  evaluatorRole: string;
  roundType: string;
  sampleSize: number;
  meanWeightedTotal: number;
  stdDevWeightedTotal: number;
  roundMeanWeightedTotal: number;
  biasFromRoundMean: number;
  biasLabel: "Strict" | "Lenient" | "Neutral";
}

interface ApiResponse {
  leaderboard: LeaderboardEntry[];
  evaluatorAnalytics: EvaluatorAnalytics[];
  meta: {
    normalization: string;
    clampRange: [number, number];
    neutralFallbackWhenStdZero: number;
  };
}

export default function NormalizedLeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [analytics, setAnalytics] = useState<EvaluatorAnalytics[]>([]);
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
    const res = await fetch("/api/admin/leaderboard-normalized");
    const data: ApiResponse = await res.json();
    setEntries(data.leaderboard || []);
    setAnalytics(data.evaluatorAnalytics || []);
    setLoading(false);
  }

  useEffect(() => {
    void loadLeaderboard();
  }, []);

  async function exportCSV() {
    const res = await fetch("/api/admin/leaderboard-normalized?format=csv");
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "hackmol7-leaderboard-normalized.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  if (loading) {
    return (
      <div>
        <h1 className="admin-page-title">Normalized Leaderboard</h1>
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
          Normalized Leaderboard
        </h1>
        <div style={{ display: "flex", gap: 8 }}>
          <Link
            href="/admin/leaderboard-normalized/method"
            className="admin-btn admin-btn-primary"
          >
            Method
          </Link>
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

      <div className="admin-card" style={{ marginBottom: 18 }}>
        <div className="admin-card-title">Normalization Notes</div>
        <p style={{ margin: "8px 0 0", color: "rgba(255,255,255,0.72)" }}>
          Scores are normalized per evaluator per round using clamped z-score
          mapping. This table keeps raw scores visible and shows rank movement
          after normalization.
        </p>
      </div>

      <div className="admin-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Norm Rank</th>
                <th>Raw Rank</th>
                <th>Delta</th>
                <th>Team No.</th>
                <th>Team Name</th>
                <th>Leader</th>
                <th>M1 Norm</th>
                <th>M2 Norm</th>
                <th>Judging Norm</th>
                <th>Norm Final</th>
                <th>Raw Final</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr
                  key={entry.teamId}
                  onClick={() => openBreakdown(entry)}
                  style={{ cursor: "pointer" }}
                  title="Click to view marks breakdown"
                >
                  <td
                    style={{
                      fontFamily: "var(--font-cinzel), serif",
                      color: entry.normalizedRank <= 3 ? "#4da8da" : undefined,
                      fontWeight: entry.normalizedRank <= 3 ? 700 : undefined,
                    }}
                  >
                    {entry.normalizedRank}
                  </td>
                  <td>{entry.rawRank}</td>
                  <td
                    style={{
                      color:
                        entry.rankDelta > 0
                          ? "#86efac"
                          : entry.rankDelta < 0
                          ? "#fca5a5"
                          : "rgba(255,255,255,0.75)",
                      fontWeight: 700,
                    }}
                  >
                    {entry.rankDelta > 0
                      ? `+${entry.rankDelta}`
                      : entry.rankDelta.toString()}
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
                  <td>{(entry.normalizedRoundDetails.MENTOR_1 ?? 0).toFixed(1)}</td>
                  <td>{(entry.normalizedRoundDetails.MENTOR_2 ?? 0).toFixed(1)}</td>
                  <td>{(entry.normalizedRoundDetails.JUDGING ?? 0).toFixed(1)}</td>
                  <td
                    style={{
                      fontFamily: "var(--font-cinzel), serif",
                      color: "#4da8da",
                      fontWeight: 700,
                    }}
                  >
                    {entry.normalizedFinalScore.toFixed(2)}
                  </td>
                  <td>{entry.rawFinalScore.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="admin-card" style={{ marginTop: 18 }}>
        <div className="admin-card-title">Evaluator Bias Snapshot</div>
        <div className="admin-table-wrap" style={{ marginTop: 10 }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Round</th>
                <th>Samples</th>
                <th>Mean</th>
                <th>Std Dev</th>
                <th>Round Mean</th>
                <th>Bias</th>
                <th>Label</th>
              </tr>
            </thead>
            <tbody>
              {analytics.map((item) => (
                <tr key={`${item.userId}-${item.roundType}`}>
                  <td>{item.evaluatorName}</td>
                  <td>{item.evaluatorRole}</td>
                  <td>{item.roundType}</td>
                  <td>{item.sampleSize}</td>
                  <td>{item.meanWeightedTotal.toFixed(2)}</td>
                  <td>{item.stdDevWeightedTotal.toFixed(2)}</td>
                  <td>{item.roundMeanWeightedTotal.toFixed(2)}</td>
                  <td
                    style={{
                      color:
                        item.biasFromRoundMean > 0
                          ? "#86efac"
                          : item.biasFromRoundMean < 0
                          ? "#fca5a5"
                          : "rgba(255,255,255,0.72)",
                    }}
                  >
                    {item.biasFromRoundMean.toFixed(2)}
                  </td>
                  <td>{item.biasLabel}</td>
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
              width: "min(1020px, 100%)",
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
                {breakdownModal.teamNumber} - {breakdownModal.teamName} (Raw + Normalized Breakdown)
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
                      <th>Role</th>
                      <th>Technical</th>
                      <th>Innovation</th>
                      <th>Impact</th>
                      <th>Demo</th>
                      <th>Presentation</th>
                      <th>Raw Total</th>
                      <th>Norm Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getCombinedRows(breakdownModal.roundBreakdown).map((row) => (
                      <tr key={row.rowKey}>
                        <td>{row.round}</td>
                        <td>{row.evaluatorName}</td>
                        <td>{row.evaluatorRole}</td>
                        <td>{row.technical}</td>
                        <td>{row.innovation}</td>
                        <td>{row.impact}</td>
                        <td>{row.demo}</td>
                        <td>{row.presentation}</td>
                        <td>{row.weightedTotal.toFixed(2)}</td>
                        <td>{row.normalizedWeightedTotal.toFixed(2)}</td>
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