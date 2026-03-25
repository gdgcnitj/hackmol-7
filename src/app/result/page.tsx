import type { Metadata } from "next";
import { promises as fs } from "node:fs";
import path from "node:path";
import styles from "./result.module.css";

type TeamEntry = {
  teamNo: string;
  teamName: string;
  teamLeaderName: string;
};

type TeamSection = "selected" | "waitlisted";

export const metadata: Metadata = {
  title: "Round 1 Results | HackMol 7.0",
  description: "HackMol 7.0 Round 1 results with selected and waitlisted teams for the offline round.",
  alternates: {
    canonical: "/result",
  },
};

function parseResultCsv(csvText: string): { selected: TeamEntry[]; waitlisted: TeamEntry[] } {
  const selected: TeamEntry[] = [];
  const waitlisted: TeamEntry[] = [];

  let currentSection: TeamSection | null = null;

  for (const rawLine of csvText.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;

    const lower = line.toLowerCase();

    if (lower.startsWith("selected teams for offline round")) {
      currentSection = "selected";
      continue;
    }

    if (lower.startsWith("waitlisted teams")) {
      currentSection = "waitlisted";
      continue;
    }

    if (lower.startsWith("team no.,team name,team leader name")) {
      continue;
    }

    const columns = rawLine.split(",").map((value) => value.trim());
    if (columns.length < 3 || !currentSection) continue;

    const [teamNo, teamName, ...leaderParts] = columns;
    const teamLeaderName = leaderParts.join(", ").trim();

    if (!teamNo || !teamName || !teamLeaderName) continue;
    if (!/^h7/i.test(teamNo)) continue;

    const entry: TeamEntry = {
      teamNo,
      teamName,
      teamLeaderName,
    };

    if (currentSection === "selected") {
      selected.push(entry);
    } else {
      waitlisted.push(entry);
    }
  }

  return { selected, waitlisted };
}

async function getResultData() {
  const csvPath = path.join(process.cwd(), "public", "result", "result.csv");
  const csvText = await fs.readFile(csvPath, "utf8");
  return parseResultCsv(csvText);
}

function TeamTable({ title, teams }: { title: string; teams: TeamEntry[] }) {
  return (
    <section className={styles.panel}>
      <div className={styles.panelHeaderRow}>
        <h2 className={styles.panelTitle}>{title}</h2>
        <span className={styles.panelCount}>{teams.length} Teams</span>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Team No.</th>
              <th>Team Name</th>
              <th>Team Leader</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team) => (
              <tr key={team.teamNo}>
                <td>{team.teamNo}</td>
                <td>{team.teamName}</td>
                <td>{team.teamLeaderName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default async function ResultPage() {
  const { selected, waitlisted } = await getResultData();

  return (
    <div className={styles.page}>
      <div className={styles.heroGlow} aria-hidden="true"></div>

      <main className={styles.container}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>HackMol 7.0</p>
          <h1 className={styles.title}>Round 1 Results</h1>
          <p className={styles.subtitle}>
            Congratulations to all shortlisted teams. The following teams are selected for the offline round.
          </p>

          <div className={styles.metrics}>
            <div className={styles.metricCard}>
              <span className={styles.metricLabel}>Selected Teams</span>
              <span className={styles.metricValue}>{selected.length}</span>
            </div>
            <div className={styles.metricCard}>
              <span className={styles.metricLabel}>Waitlisted Teams</span>
              <span className={styles.metricValue}>{waitlisted.length}</span>
            </div>
          </div>
        </header>

        <div className={styles.grid}>
          <TeamTable title="Selected Teams for Offline Round" teams={selected} />
          <TeamTable title="Waitlisted Teams" teams={waitlisted} />
        </div>

        <p className={styles.notice}>
          Note: Teams listed under the waitlist will be considered for selection in case any selected team withdraws for any reason.
        </p>
      </main>
    </div>
  );
}
