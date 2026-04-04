import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import SectionHeading from "@/components/ui/SectionHeading";
import styles from "../result.module.css";
import { parseRound1Csv, readPublicCsv } from "@/lib/resultCsv";

export const metadata: Metadata = {
  title: "Round 1 Results | HackMol 7.0",
  description:
    "HackMol 7.0 Round 1 results with selected and waitlisted teams for the offline round.",
  alternates: {
    canonical: "/result/round-1",
  },
};

async function getRound1Data() {
  const csvText = await readPublicCsv("result.csv");
  return parseRound1Csv(csvText);
}

function TeamTable({
  title,
  teams,
}: {
  title: string;
  teams: Array<{ teamNo: string; teamName: string; teamLeaderName: string }>;
}) {
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

export default async function Round1ResultPage() {
  const { selected, waitlisted } = await getRound1Data();

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
            title="Round 1"
            highlight="Results"
            description="Congratulations to all shortlisted teams. The following teams were selected for the offline round."
          />
          <div className={styles.roundNavRow}>
            <Link className={styles.roundNavLink} href="/result">
              Result Index
            </Link>
            <Link className={styles.roundNavLink} href="/result/round-2">
              View Round 2
            </Link>
          </div>
        </header>

        <div className={styles.grid}>
          <TeamTable title="Selected Teams for Offline Round" teams={selected} />
          <TeamTable title="Waitlisted Teams" teams={waitlisted} />
        </div>

        <p className={styles.notice}>
          Note: Teams listed under the waitlist were considered for selection in case any selected team withdrew.
        </p>
      </main>
    </div>
  );
}
