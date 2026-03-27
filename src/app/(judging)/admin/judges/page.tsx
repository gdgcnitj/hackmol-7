"use client";

import { useEffect, useState, type FormEvent } from "react";

interface Judge {
  id: string;
  username: string;
  name: string;
  role: "JUDGE" | "MENTOR";
  inviteToken: string | null;
  inviteUsed: boolean;
  isActive: boolean;
  createdAt: string;
  inviteLink?: string;
}

export default function JudgesPage() {
  const [judges, setJudges] = useState<Judge[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [lastCreatedLink, setLastCreatedLink] = useState<string | null>(null);

  const [form, setForm] = useState({
    username: "",
    name: "",
    password: "",
    role: "JUDGE" as "JUDGE" | "MENTOR",
  });

  useEffect(() => {
    loadJudges();
  }, []);

  async function loadJudges() {
    const res = await fetch("/api/admin/judges");
    const data = await res.json();
    setJudges(data);
    setLoading(false);
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setError("");
    setCreating(true);
    setLastCreatedLink(null);

    const res = await fetch("/api/admin/judges", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      setCreating(false);
      return;
    }

    setLastCreatedLink(data.inviteLink);
    setForm({ username: "", name: "", password: "", role: "JUDGE" });
    setCreating(false);
    loadJudges();
  }

  async function toggleActive(id: string, currentlyActive: boolean) {
    await fetch("/api/admin/judges/" + id, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !currentlyActive }),
    });
    loadJudges();
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm("Remove " + name + "? This will also delete their scores.")) {
      return;
    }
    await fetch("/api/admin/judges/" + id, { method: "DELETE" });
    loadJudges();
  }

  function copyInviteLink(token: string, id: string) {
    const baseUrl =
      typeof window !== "undefined"
        ? window.location.origin
        : "http://localhost:3000";
    const link = baseUrl + "/auth/invite/" + token;
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div>
      <h1 className="admin-page-title">Judges & Mentors</h1>

      <div className="admin-card">
        <div className="admin-card-title">Create New</div>
        {error && (
          <p
            style={{
              color: "#fca5a5",
              marginBottom: 12,
              fontSize: 14,
              fontFamily: "var(--font-perpetua), serif",
            }}
          >
            {error}
          </p>
        )}
        <form onSubmit={handleCreate}>
          <div className="admin-form-row">
            <div className="admin-form-field">
              <label className="admin-form-label">Username</label>
              <input
                className="admin-form-input"
                value={form.username}
                onChange={(e) =>
                  setForm({ ...form, username: e.target.value })
                }
                required
                autoComplete="off"
              />
            </div>
            <div className="admin-form-field">
              <label className="admin-form-label">Full Name</label>
              <input
                className="admin-form-input"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                required
              />
            </div>
            <div className="admin-form-field">
              <label className="admin-form-label">Password</label>
              <input
                className="admin-form-input"
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                required
                minLength={8}
                autoComplete="new-password"
              />
            </div>
            <div className="admin-form-field">
              <label className="admin-form-label">Role</label>
              <select
                className="admin-form-select"
                value={form.role}
                onChange={(e) =>
                  setForm({
                    ...form,
                    role: e.target.value as "JUDGE" | "MENTOR",
                  })
                }
              >
                <option value="JUDGE">Judge</option>
                <option value="MENTOR">Mentor</option>
              </select>
            </div>
            <button
              className="admin-btn admin-btn-primary"
              type="submit"
              disabled={creating}
            >
              {creating ? "Creating..." : "Create"}
            </button>
          </div>
        </form>

        {lastCreatedLink && (
          <div className="admin-invite-link">
            <span className="admin-invite-link-text">{lastCreatedLink}</span>
            <button
              className="admin-copy-btn"
              onClick={() => {
                navigator.clipboard.writeText(lastCreatedLink);
                setCopiedId("new");
                setTimeout(() => setCopiedId(null), 2000);
              }}
            >
              {copiedId === "new" ? "Copied" : "Copy"}
            </button>
          </div>
        )}
      </div>

      <div className="admin-card">
        <div className="admin-card-title">
          All Judges & Mentors ({judges.length})
        </div>
        {loading ? (
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>
            Loading...
          </p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Invite</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {judges.map((j) => (
                  <tr key={j.id}>
                    <td>{j.name}</td>
                    <td>{j.username}</td>
                    <td>
                      <span
                        className={
                          "admin-badge " +
                          (j.role === "JUDGE"
                            ? "admin-badge-judge"
                            : "admin-badge-mentor")
                        }
                      >
                        {j.role}
                      </span>
                    </td>
                    <td>
                      <span
                        className={
                          "admin-badge " +
                          (j.isActive
                            ? "admin-badge-active"
                            : "admin-badge-inactive")
                        }
                      >
                        {j.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      {j.inviteToken && (
                        <button
                          className="admin-copy-btn"
                          onClick={() =>
                            copyInviteLink(j.inviteToken!, j.id)
                          }
                        >
                          {copiedId === j.id ? "Copied" : "Copy Link"}
                        </button>
                      )}
                      {!j.inviteToken && (
                        <span
                          style={{
                            color: "rgba(255,255,255,0.3)",
                            fontSize: 12,
                          }}
                        >
                          Admin-seeded
                        </span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          className="admin-btn admin-btn-primary admin-btn-small"
                          onClick={() => toggleActive(j.id, j.isActive)}
                        >
                          {j.isActive ? "Deactivate" : "Activate"}
                        </button>
                        <button
                          className="admin-btn admin-btn-danger admin-btn-small"
                          onClick={() => handleDelete(j.id, j.name)}
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
