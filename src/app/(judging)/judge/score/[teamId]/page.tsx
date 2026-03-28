"use client";

import { useEffect, useState, useCallback, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { CRITERIA } from "@/data/rubric";

interface TeamData {
  id: string;
  teamNumber: string;
  teamName: string;
  leaderName: string;
}

interface ActiveRound {
  id: string;
  name: string;
  type: string;
  isLocked: boolean;
}

interface ExistingScore {
  technical: number;
  innovation: number;
  impact: number;
  demo: number;
  presentation: number;
  notes: string | null;
  evaluatedByCurrentUser: boolean;
  evaluatorName: string;
  evaluatorRole: string;
}

interface PreviousRoundNote {
  id: string;
  notes: string;
  submittedAt: string;
  user: { name: string; role: string };
  round: { name: string; type: string };
}

interface TeamsResponse {
  teams: (TeamData & { scored: boolean })[];
  activeRound: ActiveRound | null;
}

export default function ScorePage() {
  const params = useParams();
  const router = useRouter();
  const teamId = params.teamId as string;

  const [team, setTeam] = useState<TeamData | null>(null);
  const [activeRound, setActiveRound] = useState<ActiveRound | null>(null);
  const [allTeams, setAllTeams] = useState<TeamsResponse["teams"]>([]);
  const [scores, setScores] = useState<Record<string, number>>({
    technical: 5,
    innovation: 5,
    impact: 5,
    demo: 5,
    presentation: 5,
  });
  const [notes, setNotes] = useState("");
  const [previousRoundNotes, setPreviousRoundNotes] = useState<
    PreviousRoundNote[]
  >([]);
  const [isScoredByAnotherEvaluator, setIsScoredByAnotherEvaluator] =
    useState(false);
  const [scoredByLabel, setScoredByLabel] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    try {
      const [teamsRes, scoreRes] = await Promise.all([
        fetch("/api/judge/teams"),
        fetch("/api/judge/scores/" + teamId),
      ]);

      const teamsData: TeamsResponse = await teamsRes.json();
      const scoreData = await scoreRes.json();

      setAllTeams(teamsData.teams || []);
      setActiveRound(teamsData.activeRound || null);

      const currentTeam = teamsData.teams?.find(
        (t: TeamData) => t.id === teamId
      );
      setTeam(currentTeam || null);

      if (scoreData.score) {
        const s: ExistingScore = scoreData.score;
        setScores({
          technical: s.technical,
          innovation: s.innovation,
          impact: s.impact,
          demo: s.demo,
          presentation: s.presentation,
        });
        setNotes(s.notes || "");
        const scoredByOther = !s.evaluatedByCurrentUser;
        setIsScoredByAnotherEvaluator(scoredByOther);
        setScoredByLabel(
          scoredByOther ? s.evaluatorName + " (" + s.evaluatorRole + ")" : ""
        );
      } else {
        setIsScoredByAnotherEvaluator(false);
        setScoredByLabel("");
      }

      setPreviousRoundNotes(scoreData.previousRoundNotes || []);
    } catch {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  function handleScoreChange(key: string, value: number) {
    setScores((prev) => ({ ...prev, [key]: value }));
    setSuccess("");
    setError("");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!activeRound || activeRound.isLocked || isScoredByAnotherEvaluator) {
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/judge/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamId,
          roundId: activeRound.id,
          ...scores,
          notes: notes.trim() || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to submit score");
        setSubmitting(false);
        return;
      }

      setSuccess("Score submitted successfully");
      setSubmitting(false);

      // Attempt to close the page for quick scoring flow; fallback to dashboard.
      window.close();
      setTimeout(() => {
        router.push("/judge");
      }, 200);
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  // Find prev/next teams for navigation
  const currentIndex = allTeams.findIndex((t) => t.id === teamId);
  const prevTeam = currentIndex > 0 ? allTeams[currentIndex - 1] : null;
  const nextTeam =
    currentIndex < allTeams.length - 1 ? allTeams[currentIndex + 1] : null;

  if (loading) {
    return (
      <div className="score-page">
        <p style={{ color: "rgba(255,255,255,0.5)", textAlign: "center", marginTop: 40 }}>
          Loading...
        </p>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="score-page">
        <p style={{ color: "#fca5a5", textAlign: "center", marginTop: 40 }}>
          Team not found
        </p>
      </div>
    );
  }

  if (!activeRound) {
    return (
      <div className="score-page">
        <div className="score-locked-msg">No active round</div>
      </div>
    );
  }

  return (
    <div className="score-page">
      <div className="score-team-header">
        <div className="score-team-number">{team.teamNumber}</div>
        <div className="score-team-name">{team.teamName}</div>
        <div className="score-team-leader">{team.leaderName}</div>
        <div
          style={{
            marginTop: 8,
            fontFamily: "var(--font-perpetua), serif",
            fontSize: 13,
            color: "rgba(255,255,255,0.4)",
          }}
        >
          {activeRound.name}
          {currentIndex >= 0 &&
            " | Team " + (currentIndex + 1) + " of " + allTeams.length}
        </div>
      </div>

      {activeRound.isLocked && (
        <div className="score-locked-msg" style={{ marginBottom: 20 }}>
          This round is locked. Scores cannot be modified.
        </div>
      )}

      {isScoredByAnotherEvaluator && (
        <div className="score-locked-msg" style={{ marginBottom: 20 }}>
          This team has already been scored in this round by {scoredByLabel}.
        </div>
      )}

      {success && <div className="score-success">{success}</div>}
      {error && <div className="score-error">{error}</div>}

      {previousRoundNotes.length > 0 && (
        <div
          style={{
            marginBottom: 24,
            background: "rgba(15, 24, 41, 0.55)",
            border: "1px solid rgba(77, 168, 218, 0.15)",
            borderRadius: 10,
            padding: "16px 18px",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-trajan), serif",
              textTransform: "uppercase",
              letterSpacing: "1px",
              color: "#ffffff",
              fontSize: 14,
              marginBottom: 12,
            }}
          >
            Previous Round Notes
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {previousRoundNotes.map((note) => (
              <div
                key={note.id}
                style={{
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 8,
                  padding: "10px 12px",
                  background: "rgba(8, 14, 28, 0.6)",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-perpetua), serif",
                    fontSize: 13,
                    color: "rgba(255,255,255,0.65)",
                    marginBottom: 6,
                  }}
                >
                  {note.round.name} | {note.user.name} ({note.user.role})
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-perpetua), serif",
                    fontSize: 14,
                    color: "rgba(255,255,255,0.9)",
                    whiteSpace: "pre-wrap",
                    lineHeight: 1.45,
                  }}
                >
                  {note.notes}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="score-criteria-list">
          {CRITERIA.map((criterion) => {
            const value = scores[criterion.key] ?? 5;
            const fill = (value / 10) * 100;
            return (
              <div className="score-criterion" key={criterion.key}>
                <div className="score-criterion-header">
                  <div className="score-criterion-label">
                    {criterion.label}
                  </div>
                  <div className="score-criterion-weight">
                    Weight: {criterion.weight}x | Max: {criterion.maxWeighted}
                  </div>
                </div>
                <div className="score-criterion-desc">
                  {criterion.description}
                </div>
                <div className="score-criterion-value">{value}</div>
                <div className="score-slider-container">
                  <input
                    type="range"
                    min={0}
                    max={10}
                    step={1}
                    value={value}
                    onChange={(e) =>
                      handleScoreChange(
                        criterion.key,
                        parseInt(e.target.value, 10)
                      )
                    }
                    className="score-slider"
                    style={{ "--fill": fill + "%" } as React.CSSProperties}
                    disabled={activeRound.isLocked || isScoredByAnotherEvaluator}
                  />
                  <div className="score-slider-labels">
                    <span>0</span>
                    <span>5</span>
                    <span>10</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="score-notes">
          <div className="score-notes-label">Notes (optional)</div>
          <textarea
            className="score-notes-textarea"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any additional feedback for this team..."
            maxLength={1000}
            disabled={activeRound.isLocked || isScoredByAnotherEvaluator}
          />
        </div>

        <div className="score-actions">
          {prevTeam && (
            <button
              type="button"
              className="score-nav-btn"
              onClick={() => router.push("/judge/score/" + prevTeam.id)}
            >
              Previous: {prevTeam.teamNumber}
            </button>
          )}
          <button
            type="submit"
            className="score-submit-btn"
            disabled={
              submitting || activeRound.isLocked || isScoredByAnotherEvaluator
            }
          >
            {submitting ? "Submitting..." : "Submit Score"}
          </button>
          {nextTeam && (
            <button
              type="button"
              className="score-nav-btn"
              onClick={() => router.push("/judge/score/" + nextTeam.id)}
            >
              Next: {nextTeam.teamNumber}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
