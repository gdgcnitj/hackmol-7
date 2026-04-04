import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import SectionHeading from "@/components/ui/SectionHeading";
import styles from "./result.module.css";
import {
  parseRound2SummaryCsv,
  parseRound2TopTeamsCsv,
  readPublicCsv,
} from "@/lib/resultCsv";

export const metadata: Metadata = {
  title: "Results | HackMol 7.0",
  description: "Browse HackMol 7.0 Round 1 and Round 2 published results.",
  alternates: {
    canonical: "/result",
  },
};

function formatMetricLabel(metric: string): string {
  return metric
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatMetricValue(metric: string, value: number): string {
  if (metric.includes("normalized")) {
    return value.toFixed(2);
  }
  return String(value);
}

async function getResultHighlights() {
  try {
    const [summaryCsv, topTeamsCsv] = await Promise.all([
      readPublicCsv("round-2-summary.csv"),
      readPublicCsv("round-2-top-teams.csv"),
    ]);

    return {
      summary: parseRound2SummaryCsv(summaryCsv),
      topTeams: parseRound2TopTeamsCsv(topTeamsCsv),
    };
  } catch {
    return {
      summary: [],
      topTeams: [],
    };
  }
}

export default async function ResultPage() {
  const { summary, topTeams } = await getResultHighlights();
  const snapshotMetrics = summary.filter(
    (item) =>
      item.metric !== "scored_teams" &&
      item.metric !== "lowest_final_normalized" &&
      item.metric !== "winner_teams"
  );

  return (
    <div className={styles.page}>
      <div className={styles.heroGlow} aria-hidden="true"></div>
      <Image
        src="/assets/decorative/knight-right.png"
        alt=""
        width={180}
        height={260}
        className={`${styles.resultCharacter} ${styles.resultCharacterLeft}`}
        aria-hidden="true"
      />
      <Image
        src="/assets/decorative/knight-left.png"
        alt=""
        width={180}
        height={260}
        className={`${styles.resultCharacter} ${styles.resultCharacterRight}`}
        aria-hidden="true"
      />

      <main className={styles.container}>
        <header className={styles.header}>
          <SectionHeading
            title="Published"
            highlight="Results"
            description="Explore archived Round 1 results and the final Round 2 normalized leaderboard with winning categories."
          />
        </header>

        <div className={styles.routeCards}>
          <Link href="/result/round-1" className={styles.routeCard}>
            <p className={styles.routeCardEyebrow}>Archive</p>
            <h2 className={styles.routeCardTitle}>Round 1</h2>
            <p className={styles.routeCardCopy}>
              Selected and waitlisted teams for the offline round.
              <span className={styles.routeCardCta}>Click to view</span>
            </p>
          </Link>

          <Link href="/result/round-2" className={styles.routeCard}>
            <p className={styles.routeCardEyebrow}>Finale</p>
            <h2 className={styles.routeCardTitle}>Round 2</h2>
            <p className={styles.routeCardCopy}>
              Final normalized scores, rank table, and winner categories.
              <span className={styles.routeCardCta}>Click to view</span>
            </p>
          </Link>
        </div>

        <section className={`${styles.panel} ${styles.leaderboardPanel}`}>
          <div className={styles.panelHeaderRow}>
            <h2 className={styles.panelTitle}>Round 2 Snapshot</h2>
            <span className={styles.panelCount}>Stats</span>
          </div>

          {snapshotMetrics.length === 0 ? (
            <p className={styles.emptyState}>
              Snapshot data is unavailable right now.
            </p>
          ) : (
            <div className={styles.resultSummaryGrid}>
              {snapshotMetrics.map((item) => (
                <article key={item.metric} className={styles.resultSummaryCard}>
                  <p className={styles.resultSummaryLabel}>{formatMetricLabel(item.metric)}</p>
                  <p className={styles.resultSummaryValue}>
                    {formatMetricValue(item.metric, item.value)}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className={`${styles.panel} ${styles.leaderboardPanel}`}>
          <div className={styles.panelHeaderRow}>
            <h2 className={styles.panelTitle}>Top 10 Finalists</h2>
            <span className={styles.panelCount}>{topTeams.length} Teams</span>
          </div>

          {topTeams.length === 0 ? (
            <p className={styles.emptyState}>
              Top team highlights are unavailable right now.
            </p>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Team No.</th>
                    <th>Team Name</th>
                    <th>Team Leader</th>
                    <th>Final (Norm)</th>
                  </tr>
                </thead>
                <tbody>
                  {topTeams.map((team) => (
                    <tr key={`${team.rank}-${team.teamNo}`}>
                      <td>{team.rank}</td>
                      <td>{team.teamNo}</td>
                      <td>{team.teamName}</td>
                      <td>{team.leaderName}</td>
                      <td>{team.finalNormalized.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
