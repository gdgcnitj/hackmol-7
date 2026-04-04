import { promises as fs } from "node:fs";
import path from "node:path";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma";
import {
  computeFinalScore,
  computeRoundAverage,
  computeWeightedTotal,
  type RoundScore,
} from "../src/lib/scoring";

async function loadEnvFileIfPresent(fileName: string): Promise<void> {
  const filePath = path.join(process.cwd(), fileName);

  try {
    const raw = await fs.readFile(filePath, "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;

      const eqIndex = trimmed.indexOf("=");
      if (eqIndex <= 0) continue;

      const key = trimmed.slice(0, eqIndex).trim();
      let value = trimmed.slice(eqIndex + 1).trim();

      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  } catch {
    // Ignore missing env files.
  }
}

type WinnerCsvRow = {
  teamNo: string;
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function computeMean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function computeStdDev(values: number[], mean: number): number {
  if (values.length < 2) return 0;
  const variance = values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

function normalizeWeightedTotal(rawWeightedTotal: number, evaluatorMean: number, evaluatorStdDev: number): number {
  if (evaluatorStdDev < 1e-9) {
    return 50;
  }

  const zScore = (rawWeightedTotal - evaluatorMean) / evaluatorStdDev;
  const clamped = clamp(zScore, -2, 2);
  const normalized = ((clamped + 2) / 4) * 100;
  return Math.round(normalized * 100) / 100;
}

function escapeCsv(value: string | number): string {
  const text = String(value ?? "");
  if (text.includes(",") || text.includes('"') || text.includes("\n")) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function roundToTwo(value: number): number {
  return Math.round(value * 100) / 100;
}

function computeMedian(values: number[]): number {
  if (values.length === 0) return 0;

  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return roundToTwo((sorted[mid - 1] + sorted[mid]) / 2);
  }

  return roundToTwo(sorted[mid]);
}

function parseCsvLine(rawLine: string): string[] {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < rawLine.length; i += 1) {
    const char = rawLine[i];

    if (char === '"') {
      if (inQuotes && rawLine[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      values.push(current.trim().replace(/^"|"$/g, ""));
      current = "";
      continue;
    }

    current += char;
  }

  values.push(current.trim().replace(/^"|"$/g, ""));
  return values;
}

async function readWinnerTeamNumbers(): Promise<Set<string>> {
  const winnersPath = path.join(process.cwd(), "public", "result", "round-2-winners.csv");

  try {
    const raw = await fs.readFile(winnersPath, "utf8");
    const lines = raw.split(/\r?\n/).filter((line) => line.trim().length > 0);
    if (lines.length <= 1) return new Set();

    const rows: WinnerCsvRow[] = lines.slice(1).map((line) => {
      const [, , , teamNo] = parseCsvLine(line);
      return { teamNo: (teamNo || "").trim().toUpperCase() };
    });

    return new Set(rows.map((row) => row.teamNo).filter(Boolean));
  } catch {
    return new Set();
  }
}

async function publishRound2Csv() {
  await loadEnvFileIfPresent(".env");
  await loadEnvFileIfPresent(".env.local");

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required to publish round-2 CSV");
  }

  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  });

  const prisma = new PrismaClient({ adapter });

  try {
    const [teams, rounds, scores, winnerTeamNumbers] = await Promise.all([
      prisma.team.findMany({ orderBy: { teamNumber: "asc" } }),
      prisma.round.findMany({ orderBy: { createdAt: "asc" } }),
      prisma.score.findMany({
        include: {
          round: { select: { id: true, type: true, weight: true } },
          user: { select: { id: true } },
        },
      }),
      readWinnerTeamNumbers(),
    ]);

    const enrichedScores = scores.map((score) => ({
      ...score,
      weightedTotal: computeWeightedTotal({
        technical: score.technical,
        innovation: score.innovation,
        impact: score.impact,
        demo: score.demo,
        presentation: score.presentation,
      }),
    }));

    const evaluatorTotals = new Map<string, number[]>();

    for (const score of enrichedScores) {
      const evaluatorKey = `${score.roundId}:${score.userId}`;
      const totalsByEvaluator = evaluatorTotals.get(evaluatorKey) ?? [];
      totalsByEvaluator.push(score.weightedTotal);
      evaluatorTotals.set(evaluatorKey, totalsByEvaluator);

    }

    const evaluatorStats = new Map<string, { mean: number; stdDev: number }>();
    for (const [key, totals] of evaluatorTotals.entries()) {
      const mean = computeMean(totals);
      const stdDev = computeStdDev(totals, mean);
      evaluatorStats.set(key, { mean, stdDev });
    }

    const scoresByTeam = new Map<string, typeof enrichedScores>();
    for (const score of enrichedScores) {
      const existing = scoresByTeam.get(score.teamId) ?? [];
      existing.push(score);
      scoresByTeam.set(score.teamId, existing);
    }

    const leaderboard = teams.map((team) => {
      const teamScores = scoresByTeam.get(team.id) ?? [];
      const rawRoundScores: RoundScore[] = [];
      const normalizedRoundScores: RoundScore[] = [];

      for (const round of rounds) {
        const roundTeamScores = teamScores.filter((entry) => entry.roundId === round.id);

        const rawTotals = roundTeamScores.map((entry) => entry.weightedTotal);
        const normalizedTotals = roundTeamScores.map((entry) => {
          const evaluatorKey = `${entry.roundId}:${entry.userId}`;
          const stats = evaluatorStats.get(evaluatorKey);
          return normalizeWeightedTotal(
            entry.weightedTotal,
            stats?.mean ?? entry.weightedTotal,
            stats?.stdDev ?? 0
          );
        });

        rawRoundScores.push({
          roundType: round.type,
          roundWeight: round.weight,
          average: computeRoundAverage(rawTotals),
        });

        normalizedRoundScores.push({
          roundType: round.type,
          roundWeight: round.weight,
          average: computeRoundAverage(normalizedTotals),
        });
      }

      const rawFinalScore = computeFinalScore(rawRoundScores);
      const normalizedFinalScore = computeFinalScore(normalizedRoundScores);

      const normalizedRoundDetails: Record<string, number> = {};
      for (const score of normalizedRoundScores) {
        normalizedRoundDetails[score.roundType] = score.average;
      }

      return {
        teamNumber: team.teamNumber,
        teamName: team.teamName,
        leaderName: team.leaderName,
        rawFinalScore,
        normalizedFinalScore,
        normalizedRoundDetails,
      };
    });

    const sorted = [...leaderboard].sort((a, b) => {
      if (b.normalizedFinalScore !== a.normalizedFinalScore) {
        return b.normalizedFinalScore - a.normalizedFinalScore;
      }
      if (b.rawFinalScore !== a.rawFinalScore) {
        return b.rawFinalScore - a.rawFinalScore;
      }
      return a.teamNumber.localeCompare(b.teamNumber);
    });

    const header = [
      "rank",
      "team_no",
      "team_name",
      "leader_name",
      "mentor_1_normalized",
      "mentor_2_normalized",
      "judging_normalized",
      "final_normalized",
      "qualification_status",
    ].join(",");

    const rows = sorted.map((entry, index) => {
      const status = winnerTeamNumbers.has(entry.teamNumber.toUpperCase())
        ? "WINNER"
        : "PARTICIPATED";

      return [
        index + 1,
        escapeCsv(entry.teamNumber),
        escapeCsv(entry.teamName),
        escapeCsv(entry.leaderName),
        entry.normalizedRoundDetails.MENTOR_1 ?? 0,
        entry.normalizedRoundDetails.MENTOR_2 ?? 0,
        entry.normalizedRoundDetails.JUDGING ?? 0,
        entry.normalizedFinalScore,
        status,
      ].join(",");
    });

    const outputPath = path.join(process.cwd(), "public", "result", "round-2.csv");
    await fs.writeFile(outputPath, `${header}\n${rows.join("\n")}\n`, "utf8");

    const finalScores = sorted.map((entry) => entry.normalizedFinalScore);
    const sumScores = finalScores.reduce((sum, value) => sum + value, 0);
    const averageFinal = finalScores.length > 0 ? roundToTwo(sumScores / finalScores.length) : 0;
    const medianFinal = computeMedian(finalScores);
    const maxFinal = finalScores.length > 0 ? roundToTwo(Math.max(...finalScores)) : 0;
    const minFinal = finalScores.length > 0 ? roundToTwo(Math.min(...finalScores)) : 0;
    const scoredTeams = sorted.filter((entry) => entry.normalizedFinalScore > 0).length;
    const winnerCount = sorted.filter((entry) => winnerTeamNumbers.has(entry.teamNumber.toUpperCase())).length;

    const summaryHeader = "metric,value";
    const summaryRows = [
      ["total_teams", sorted.length],
      ["scored_teams", scoredTeams],
      ["winner_teams", winnerCount],
      ["average_final_normalized", averageFinal],
      ["median_final_normalized", medianFinal],
      ["highest_final_normalized", maxFinal],
      ["lowest_final_normalized", minFinal],
    ].map(([metric, value]) => `${metric},${value}`);

    const summaryPath = path.join(process.cwd(), "public", "result", "round-2-summary.csv");
    await fs.writeFile(summaryPath, `${summaryHeader}\n${summaryRows.join("\n")}\n`, "utf8");

    const topTeamsHeader = "rank,team_no,team_name,leader_name,final_normalized";
    const topTeamRows = sorted
      .slice(0, 10)
      .map((entry, index) =>
        [
          index + 1,
          escapeCsv(entry.teamNumber),
          escapeCsv(entry.teamName),
          escapeCsv(entry.leaderName),
          entry.normalizedFinalScore,
        ].join(",")
      );

    const topTeamsPath = path.join(process.cwd(), "public", "result", "round-2-top-teams.csv");
    await fs.writeFile(topTeamsPath, `${topTeamsHeader}\n${topTeamRows.join("\n")}\n`, "utf8");

    console.log(`Published Round 2 CSV to ${outputPath}`);
    console.log(`Published Round 2 summary to ${summaryPath}`);
    console.log(`Published Round 2 top teams to ${topTeamsPath}`);
    console.log(`Rows exported: ${rows.length}`);
  } finally {
    await prisma.$disconnect();
  }
}

publishRound2Csv().catch((error) => {
  console.error(error instanceof Error ? error.message : "Unknown publish error");
  process.exit(1);
});
