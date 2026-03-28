"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Team {
  id: string;
  teamNumber: string;
  teamName: string;
  leaderName: string;
  scored: boolean;
}

interface ActiveRound {
  id: string;
  name: string;
  type: string;
  isLocked: boolean;
}

export default function JudgeTeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [activeRound, setActiveRound] = useState<ActiveRound | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/judge/teams");
      const data = await res.json();
      setTeams(data.teams || []);
      setActiveRound(data.activeRound || null);
      setLoading(false);
    }
    load();
  }, []);

  const query = search.trim().toLowerCase();
  const hasQuery = query.length > 0;

  const filtered = hasQuery
    ? teams.filter(
        (t) =>
          t.teamNumber.toLowerCase().includes(query) ||
          t.teamName.toLowerCase().includes(query)
      )
    : [];

  const scoredCount = teams.filter((t) => t.scored).length;
  const pendingCount = teams.length - scoredCount;

  if (loading) {
    return (
      <p style={{ color: "rgba(255,255,255,0.5)", textAlign: "center", marginTop: 40 }}>
        Loading teams...
      </p>
    );
  }

  if (!activeRound) {
    return (
      <div style={{ textAlign: "center", marginTop: 60 }}>
        <h2
          style={{
            fontFamily: "var(--font-trajan), serif",
            color: "#ffffff",
            fontSize: "clamp(18px, 2.5vw, 24px)",
            textTransform: "uppercase",
            letterSpacing: "2px",
          }}
        >
          No Active Round
        </h2>
        <p
          style={{
            fontFamily: "var(--font-perpetua), serif",
            color: "rgba(255,255,255,0.5)",
            marginTop: 8,
          }}
        >
          Please wait for the admin to activate a round.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2
          style={{
            fontFamily: "var(--font-trajan), serif",
            color: "#ffffff",
            fontSize: "clamp(16px, 2vw, 22px)",
            textTransform: "uppercase",
            letterSpacing: "2px",
            marginBottom: 4,
          }}
        >
          {activeRound.name}
        </h2>
        {activeRound.isLocked && (
          <span className="judge-team-status judge-status-scored">
            Round Locked
          </span>
        )}
      </div>

      <div className="judge-count-bar">
        <div>
          Total: <span>{teams.length}</span>
        </div>
        <div>
          Scored: <span>{scoredCount}</span>
        </div>
        <div>
          Pending: <span>{pendingCount}</span>
        </div>
      </div>

      <div className="judge-search-bar">
        <input
          className="judge-search-input"
          placeholder="Search by team ID or team name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {!hasQuery && (
        <p
          style={{
            color: "rgba(255,255,255,0.5)",
            textAlign: "center",
            marginTop: 28,
            fontFamily: "var(--font-perpetua), serif",
            fontSize: 16,
          }}
        >
          Start typing a team ID or team name to find a team.
        </p>
      )}

      {hasQuery && (
        <div className="judge-teams-grid">
          {filtered.map((team) => (
            <Link
              key={team.id}
              href={"/judge/score/" + team.id}
              className={
                "judge-team-card" +
                (team.scored ? " judge-team-card-scored" : "")
              }
            >
              <div className="judge-team-number">{team.teamNumber}</div>
              <div className="judge-team-name">{team.teamName}</div>
              <div className="judge-team-leader">{team.leaderName}</div>
              <div
                className={
                  "judge-team-status " +
                  (team.scored ? "judge-status-scored" : "judge-status-pending")
                }
              >
                {team.scored ? "Scored" : "Pending"}
              </div>
            </Link>
          ))}
        </div>
      )}

      {hasQuery && filtered.length === 0 && (
        <p
          style={{
            color: "rgba(255,255,255,0.4)",
            textAlign: "center",
            marginTop: 40,
            fontFamily: "var(--font-perpetua), serif",
          }}
        >
          No teams match your search or filter
        </p>
      )}
    </div>
  );
}
