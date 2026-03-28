"use client";

import { Fragment, useEffect, useState } from "react";

interface Score {
  id: string;
  technical: number;
  innovation: number;
  impact: number;
  demo: number;
  presentation: number;
  notes: string | null;
  submittedAt: string;
  user: { name: string; role: string };
  round: { name: string; type: string };
}

interface Team {
  id: string;
  teamNumber: string;
  teamName: string;
  leaderName: string;
  scores: Score[];
}

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedTeam, setExpandedTeam] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/admin/teams");
      const data = await res.json();
      setTeams(data);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = teams.filter(
    (t) =>
      t.teamNumber.toLowerCase().includes(search.toLowerCase()) ||
      t.teamName.toLowerCase().includes(search.toLowerCase()) ||
      t.leaderName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 className="admin-page-title">Teams</h1>

      <div className="admin-card" style={{ marginBottom: 20 }}>
        <input
          className="admin-form-input"
          placeholder="Search teams..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: "100%", maxWidth: 400 }}
        />
      </div>

      {loading ? (
        <p style={{ color: "rgba(255,255,255,0.5)" }}>Loading...</p>
      ) : (
        <div className="admin-card">
          <div className="admin-card-title">
            {filtered.length} teams{search ? " matching" : ""}
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Team No.</th>
                  <th>Team Name</th>
                  <th>Leader</th>
                  <th>Scores</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <Fragment key={t.id}>
                    <tr key={t.id}>
                      <td>{t.teamNumber}</td>
                      <td>{t.teamName}</td>
                      <td>{t.leaderName}</td>
                      <td>{t.scores.length}</td>
                      <td>
                        <button
                          className="admin-btn admin-btn-primary admin-btn-small"
                          onClick={() =>
                            setExpandedTeam(
                              expandedTeam === t.id ? null : t.id
                            )
                          }
                        >
                          {expandedTeam === t.id ? "Hide" : "View"}
                        </button>
                      </td>
                    </tr>
                    {expandedTeam === t.id && t.scores.length > 0 && (
                      <tr key={t.id + "-details"}>
                        <td
                          colSpan={5}
                          style={{
                            padding: "0 16px 16px",
                            background: "rgba(77, 168, 218, 0.03)",
                          }}
                        >
                          <table className="admin-table" style={{ marginTop: 8 }}>
                            <thead>
                              <tr>
                                <th>Round</th>
                                <th>Judge</th>
                                <th>Tech</th>
                                <th>Innovation</th>
                                <th>Impact</th>
                                <th>Demo</th>
                                <th>Presentation</th>
                                <th>Notes</th>
                              </tr>
                            </thead>
                            <tbody>
                              {t.scores.map((s) => (
                                <tr key={s.id}>
                                  <td>{s.round.name}</td>
                                  <td>
                                    {s.user.name}{" "}
                                    <span
                                      className={
                                        "admin-badge " +
                                        (s.user.role === "JUDGE"
                                          ? "admin-badge-judge"
                                          : "admin-badge-mentor")
                                      }
                                    >
                                      {s.user.role}
                                    </span>
                                  </td>
                                  <td>{s.technical}</td>
                                  <td>{s.innovation}</td>
                                  <td>{s.impact}</td>
                                  <td>{s.demo}</td>
                                  <td>{s.presentation}</td>
                                  <td>{s.notes?.trim() || "-"}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    )}
                    {expandedTeam === t.id && t.scores.length === 0 && (
                      <tr key={t.id + "-empty"}>
                        <td
                          colSpan={5}
                          style={{
                            color: "rgba(255,255,255,0.4)",
                            fontSize: 14,
                            fontStyle: "italic",
                          }}
                        >
                          No scores submitted yet
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
