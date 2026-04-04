import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import SectionHeading from "@/components/ui/SectionHeading";
import styles from "../result.module.css";
import {
  parseRound2LeaderboardCsv,
  parseRound2WinnersCsv,
  readPublicCsv,
} from "@/lib/resultCsv";

export const metadata: Metadata = {
  title: "Round 2 Results | HackMol 7.0",
  description:
    "HackMol 7.0 Round 2 final normalized leaderboard with category-wise winning teams.",
  alternates: {
    canonical: "/result/round-2",
  },
};

async function getRound2Data() {
  const [leaderboardCsv, winnersCsv] = await Promise.all([
    readPublicCsv("round-2.csv"),
    readPublicCsv("round-2-winners.csv"),
  ]);

  return {
    leaderboard: parseRound2LeaderboardCsv(leaderboardCsv),
    winners: parseRound2WinnersCsv(winnersCsv),
  };
}

function formatScore(value: number): string {
  return value.toFixed(2);
}

function normalizeKey(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export default async function Round2ResultPage() {
  const { leaderboard, winners } = await getRound2Data();

  const leaderByTeamNo = new Map(
    leaderboard.map((entry) => [entry.teamNo.toUpperCase(), entry.leaderName])
  );
  const leaderByTeamName = new Map(
    leaderboard.map((entry) => [normalizeKey(entry.teamName), entry.leaderName])
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
            title="Round 2"
            highlight="Results"
            description="Final normalized leaderboard with rank and category winners from the published result CSV."
          />
          <div className={styles.roundNavRow}>
            <Link className={styles.roundNavLink} href="/result">
              Result Index
            </Link>
            <Link className={styles.roundNavLink} href="/result/round-1">
              View Round 1
            </Link>
          </div>
        </header>

        <section className={styles.panel}>
          <div className={styles.panelHeaderRow}>
            <h2 className={styles.panelTitle}>Final Winning Teams</h2>
            <span className={styles.panelCount}>{winners.length} Categories</span>
          </div>

          {winners.length === 0 ? (
            <p className={styles.emptyState}>Winners CSV is currently empty.</p>
          ) : (
            <div className={styles.tableWrap}>
              <table className={`${styles.table} ${styles.winnersTable}`}>
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Team Name</th>
                    <th>Team Leader</th>
                  </tr>
                </thead>
                <tbody>
                  {winners.map((winner) => {
                    const leaderName =
                      leaderByTeamNo.get(winner.teamNo.toUpperCase()) ??
                      leaderByTeamName.get(normalizeKey(winner.teamName)) ??
                      "-";

                    return (
                      <tr key={`${winner.displayOrder}-${winner.category}-${winner.teamName}`}>
                        <td>{winner.category}</td>
                        <td className={styles.winnerTeamCell}>{winner.teamName}</td>
                        <td>{leaderName}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className={`${styles.panel} ${styles.leaderboardPanel}`}>
          <div className={styles.panelHeaderRow}>
            <h2 className={styles.panelTitle}>Normalized Leaderboard</h2>
            <span className={styles.panelCount}>{leaderboard.length} Teams</span>
          </div>

          {leaderboard.length === 0 ? (
            <p className={styles.emptyState}>
              Round 2 leaderboard is unavailable right now.
            </p>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Team ID</th>
                    <th>Team Name</th>
                    <th>Mentor R1</th>
                    <th>Mentor R2</th>
                    <th>Judging</th>
                    <th>Final (Norm)</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry) => (
                    <tr key={`${entry.rank}-${entry.teamNo}`}>
                      <td>{entry.rank}</td>
                      <td>{entry.teamNo}</td>
                      <td>{entry.teamName}</td>
                      <td>{formatScore(entry.mentor1Normalized)}</td>
                      <td>{formatScore(entry.mentor2Normalized)}</td>
                      <td>{formatScore(entry.judgingNormalized)}</td>
                      <td className={styles.leaderboardFinalCell}>{formatScore(entry.finalNormalized)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <p className={styles.notice}>
          Note: Round 2 scores are normalized and frozen after publication.
        </p>
      </main>
    </div>
  );
}
