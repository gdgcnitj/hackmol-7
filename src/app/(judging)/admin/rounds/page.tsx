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
}

export default function RoundsPage() {
  const [rounds, setRounds] = useState<Round[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRounds();
  }, []);

  async function loadRounds() {
    const res = await fetch("/api/admin/rounds");
    const data = await res.json();
    setRounds(data);
    setLoading(false);
  }

  async function toggleField(
    id: string,
    field: "isActive" | "isLocked",
    currentValue: boolean
  ) {
    await fetch("/api/admin/rounds", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, [field]: !currentValue }),
    });
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
                {round._count.assignments} assignments | {round._count.scores}{" "}
                scores
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
    </div>
  );
}
