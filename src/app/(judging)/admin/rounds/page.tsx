"use client";

import { useEffect, useState } from "react";

interface Round {
  id: string;
  name: string;
  type: string;
  weight: number;
  isActive: boolean;
  isLocked: boolean;
  _count: {
    assignments: number;
    scores: number;
  };
  evaluatorRole: "MENTOR" | "JUDGE";
  evaluatorWorkload: {
    userId: string;
    name: string;
    role: "MENTOR" | "JUDGE";
    scoredTeams: number;
    teams: {
      teamId: string;
      teamNumber: string;
      teamName: string;
    }[];
  }[];
}

export default function RoundsPage() {
  const [rounds, setRounds] = useState<Round[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [teamModal, setTeamModal] = useState<{
    title: string;
    teams: { teamId: string; teamNumber: string; teamName: string }[];
  } | null>(null);

  async function loadRounds() {
    const res = await fetch("/api/admin/rounds");
    const data = await res.json();
    setRounds(data);
    setLoading(false);
  }

  useEffect(() => {
    void loadRounds();
  }, []);

  async function toggleField(
    id: string,
    field: "isActive" | "isLocked",
    currentValue: boolean
  ) {
    const res = await fetch("/api/admin/rounds", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, [field]: !currentValue }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({ error: "Request failed" }));
      setErrorMessage(data.error || "Request failed");
      return;
    }

    setErrorMessage(null);
    loadRounds();
  }

  if (loading) {
    return (
      <div>
        <h1 className="admin-page-title">Rounds</h1>
        <p style={{ color: "rgba(255,255,255,0.5)" }}>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="admin-page-title">Rounds</h1>

      {errorMessage && (
        <div
          className="admin-card"
          style={{
            marginBottom: 16,
            border: "1px solid rgba(239, 68, 68, 0.6)",
            color: "#fecaca",
          }}
        >
          {errorMessage}
        </div>
      )}

      <div className="admin-stats-grid">
        {rounds.map((round) => (
          <div className="admin-card" key={round.id}>
            <div className="admin-card-title">{round.name}</div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                marginTop: 12,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    color: "rgba(255,255,255,0.6)",
                    fontFamily: "var(--font-perpetua), serif",
                    fontSize: 14,
                  }}
                >
                  Weight: {round.weight}%
                </span>
                <span
                  className={
                    "admin-badge " +
                    (round.isActive ? "admin-badge-active" : "admin-badge-inactive")
                  }
                >
                  {round.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <div
                style={{
                  color: "rgba(255,255,255,0.5)",
                  fontFamily: "var(--font-perpetua), serif",
                  fontSize: 13,
                }}
              >
                {round._count.scores}{" "}
                {round.evaluatorRole === "MENTOR" ? "mentored" : "judged"}
              </div>

              <div
                style={{
                  borderTop: "1px solid rgba(255,255,255,0.1)",
                  paddingTop: 10,
                }}
              >
                <div
                  style={{
                    color: "rgba(255,255,255,0.85)",
                    fontFamily: "var(--font-cinzel), serif",
                    fontSize: 13,
                    letterSpacing: "0.4px",
                    marginBottom: 8,
                  }}
                >
                  {round.evaluatorRole === "MENTOR"
                    ? "Mentor Workload"
                    : "Judge Workload"}
                </div>

                {round.evaluatorWorkload.length === 0 ? (
                  <div
                    style={{
                      color: "rgba(255,255,255,0.5)",
                      fontFamily: "var(--font-perpetua), serif",
                      fontSize: 13,
                    }}
                  >
                    No {round.evaluatorRole.toLowerCase()} activity yet.
                  </div>
                ) : (
                  <div className="admin-table-wrap">
                    <table className="admin-table" style={{ minWidth: 420 }}>
                      <thead>
                        <tr>
                          <th>{round.evaluatorRole}</th>
                          <th>
                            {round.evaluatorRole === "MENTOR"
                              ? "Mentored"
                              : "Scored"}
                          </th>
                          <th>Teams</th>
                        </tr>
                      </thead>
                      <tbody>
                        {round.evaluatorWorkload.map((entry) => (
                          <tr key={entry.userId}>
                            <td>{entry.name}</td>
                            <td>{entry.scoredTeams}</td>
                            <td>
                              {entry.teams.length === 0 ? (
                                <span style={{ color: "rgba(255,255,255,0.5)" }}>
                                  -
                                </span>
                              ) : (
                                <button
                                  className="admin-btn admin-btn-primary admin-btn-small"
                                  onClick={() =>
                                    setTeamModal({
                                      title:
                                        entry.name +
                                        " | " +
                                        (round.evaluatorRole === "MENTOR"
                                          ? "Mentored"
                                          : "Scored") +
                                        " Teams",
                                      teams: entry.teams,
                                    })
                                  }
                                >
                                  View Teams ({entry.teams.length})
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button
                  className="admin-btn admin-btn-primary admin-btn-small"
                  onClick={() =>
                    toggleField(round.id, "isActive", round.isActive)
                  }
                >
                  {round.isActive ? "Deactivate" : "Activate"}
                </button>
                <button
                  className={
                    "admin-btn admin-btn-small " +
                    (round.isLocked
                      ? "admin-btn-primary"
                      : "admin-btn-danger")
                  }
                  onClick={() =>
                    toggleField(round.id, "isLocked", round.isLocked)
                  }
                >
                  {round.isLocked ? "Unlock" : "Lock"}
                </button>
              </div>

              {round.isLocked && (
                <span className="admin-badge admin-badge-locked">Locked</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {teamModal && (
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
          onClick={() => setTeamModal(null)}
        >
          <div
            className="admin-card"
            style={{
              width: "min(720px, 100%)",
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
                {teamModal.title}
              </div>
              <button
                className="admin-btn admin-btn-danger admin-btn-small"
                onClick={() => setTeamModal(null)}
              >
                Close
              </button>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Team Number</th>
                    <th>Team Name</th>
                  </tr>
                </thead>
                <tbody>
                  {teamModal.teams.map((team) => (
                    <tr key={team.teamId}>
                      <td>{team.teamNumber}</td>
                      <td>{team.teamName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
