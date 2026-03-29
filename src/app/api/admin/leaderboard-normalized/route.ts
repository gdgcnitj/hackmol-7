import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  computeWeightedTotal,
  computeRoundAverage,
  computeFinalScore,
} from "@/lib/scoring";
import type { RoundScore } from "@/lib/scoring";

type RoundType = "MENTOR_1" | "MENTOR_2" | "JUDGING";

function parseAllGirlsTeamNumbers(): Set<string> {
  const raw = process.env.ALL_GIRLS_TEAMS || process.env.ALL_GIRLS_TEAM || "";
  return new Set(
    raw
      .split(",")
      .map((value) => value.trim().toUpperCase())
      .filter(Boolean)
  );
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function computeMean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function computeStdDev(values: number[], mean: number): number {
  if (values.length < 2) return 0;
  const variance =
    values.reduce((sum, value) => sum + (value - mean) ** 2, 0) /
    values.length;
  return Math.sqrt(variance);
}

function normalizeWeightedTotal(
  rawWeightedTotal: number,
  evaluatorMean: number,
  evaluatorStdDev: number
): number {
  // Fallback to neutral normalized score if evaluator has near-zero variance.
  if (evaluatorStdDev < 1e-9) {
    return 50;
  }

  const zScore = (rawWeightedTotal - evaluatorMean) / evaluatorStdDev;
  const clamped = clamp(zScore, -2, 2);
  const normalized = ((clamped + 2) / 4) * 100;
  return Math.round(normalized * 100) / 100;
}

interface EvaluatorStats {
  count: number;
  mean: number;
  stdDev: number;
  roundMean: number;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format");
    const allGirlsTeamNumbers = parseAllGirlsTeamNumbers();

    const teams = await prisma.team.findMany({
      orderBy: { teamNumber: "asc" },
    });

    const rounds = await prisma.round.findMany({
      orderBy: { createdAt: "asc" },
    });

    const scores = await prisma.score.findMany({
      include: {
        round: { select: { id: true, type: true, weight: true } },
        user: { select: { id: true, role: true, name: true } },
      },
    });

    const enrichedScores = scores.map((score) => {
      const weightedTotal = computeWeightedTotal({
        technical: score.technical,
        innovation: score.innovation,
        impact: score.impact,
        demo: score.demo,
        presentation: score.presentation,
      });

      return {
        ...score,
        weightedTotal,
      };
    });

    const evaluatorTotals = new Map<string, number[]>();
    const roundTotals = new Map<string, number[]>();

    for (const score of enrichedScores) {
      const evaluatorKey = `${score.roundId}:${score.userId}`;

      const existingEvaluatorTotals = evaluatorTotals.get(evaluatorKey) || [];
      existingEvaluatorTotals.push(score.weightedTotal);
      evaluatorTotals.set(evaluatorKey, existingEvaluatorTotals);

      const existingRoundTotals = roundTotals.get(score.roundId) || [];
      existingRoundTotals.push(score.weightedTotal);
      roundTotals.set(score.roundId, existingRoundTotals);
    }

    const evaluatorStats = new Map<string, EvaluatorStats>();
    for (const [key, totals] of evaluatorTotals.entries()) {
      const [roundId] = key.split(":");
      const mean = computeMean(totals);
      const stdDev = computeStdDev(totals, mean);
      const thisRoundTotals = roundTotals.get(roundId) || [];
      const roundMean = computeMean(thisRoundTotals);

      evaluatorStats.set(key, {
        count: totals.length,
        mean,
        stdDev,
        roundMean,
      });
    }

    const scoresByTeam = new Map<string, typeof enrichedScores>();
    for (const score of enrichedScores) {
      const existing = scoresByTeam.get(score.teamId) || [];
      existing.push(score);
      scoresByTeam.set(score.teamId, existing);
    }

    const leaderboardEntries = teams.map((team) => {
      const teamScores = scoresByTeam.get(team.id) || [];

      const roundBreakdown: Record<
        string,
        Array<{
          evaluatorRole: string;
          evaluatorLabel: string;
          evaluatorName: string;
          technical: number;
          innovation: number;
          impact: number;
          demo: number;
          presentation: number;
          weightedTotal: number;
          normalizedWeightedTotal: number;
          evaluatorMean: number;
          evaluatorStdDev: number;
        }>
      > = {};

      const rawRoundScores: RoundScore[] = [];
      const normalizedRoundScores: RoundScore[] = [];

      for (const round of rounds) {
        const roundTeamScores = teamScores.filter((s) => s.roundId === round.id);

        const submissions = roundTeamScores.map((s, index) => {
          const evaluatorKey = `${s.roundId}:${s.userId}`;
          const stats = evaluatorStats.get(evaluatorKey);
          const evaluatorMean = stats?.mean ?? s.weightedTotal;
          const evaluatorStdDev = stats?.stdDev ?? 0;

          const evaluatorLabelPrefix =
            s.user.role === "MENTOR"
              ? "Mentor"
              : s.user.role === "JUDGE"
              ? "Judge"
              : "Admin";

          return {
            evaluatorRole: s.user.role,
            evaluatorLabel: `${evaluatorLabelPrefix} ${index + 1}`,
            evaluatorName: s.user.name,
            technical: s.technical,
            innovation: s.innovation,
            impact: s.impact,
            demo: s.demo,
            presentation: s.presentation,
            weightedTotal: s.weightedTotal,
            normalizedWeightedTotal: normalizeWeightedTotal(
              s.weightedTotal,
              evaluatorMean,
              evaluatorStdDev
            ),
            evaluatorMean: Math.round(evaluatorMean * 100) / 100,
            evaluatorStdDev: Math.round(evaluatorStdDev * 100) / 100,
          };
        });

        const rawTotals = submissions.map((submission) => submission.weightedTotal);
        const normalizedTotals = submissions.map(
          (submission) => submission.normalizedWeightedTotal
        );

        roundBreakdown[round.type] = submissions;

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
      const totalEvaluators = new Set(teamScores.map((s) => s.userId)).size;

      const rawRoundDetails: Record<string, number> = {};
      const normalizedRoundDetails: Record<string, number> = {};
      for (const score of rawRoundScores) {
        rawRoundDetails[score.roundType] = score.average;
      }
      for (const score of normalizedRoundScores) {
        normalizedRoundDetails[score.roundType] = score.average;
      }

      return {
        teamId: team.id,
        teamNumber: team.teamNumber,
        teamName: team.teamName,
        leaderName: team.leaderName,
        isAllGirls: allGirlsTeamNumbers.has(team.teamNumber.toUpperCase()),
        rawFinalScore,
        normalizedFinalScore,
        totalEvaluators,
        rawRoundDetails,
        normalizedRoundDetails,
        roundBreakdown,
      };
    });

    const rawRankMap = new Map<string, number>();
    const rawSorted = [...leaderboardEntries].sort((a, b) => {
      if (b.rawFinalScore !== a.rawFinalScore) {
        return b.rawFinalScore - a.rawFinalScore;
      }
      return a.teamNumber.localeCompare(b.teamNumber);
    });

    rawSorted.forEach((entry, index) => {
      rawRankMap.set(entry.teamId, index + 1);
    });

    const normalizedSorted = [...leaderboardEntries].sort((a, b) => {
      if (b.normalizedFinalScore !== a.normalizedFinalScore) {
        return b.normalizedFinalScore - a.normalizedFinalScore;
      }
      if (b.rawFinalScore !== a.rawFinalScore) {
        return b.rawFinalScore - a.rawFinalScore;
      }
      return a.teamNumber.localeCompare(b.teamNumber);
    });

    const leaderboard = normalizedSorted.map((entry, index) => {
      const normalizedRank = index + 1;
      const rawRank = rawRankMap.get(entry.teamId) ?? normalizedRank;

      return {
        ...entry,
        finalScore: entry.normalizedFinalScore,
        normalizedRank,
        rawRank,
        rankDelta: rawRank - normalizedRank,
      };
    });

    const evaluatorMeta = new Map<
      string,
      { userId: string; evaluatorName: string; evaluatorRole: string; roundType: RoundType }
    >();
    for (const score of enrichedScores) {
      const key = `${score.roundId}:${score.userId}`;
      if (!evaluatorMeta.has(key)) {
        evaluatorMeta.set(key, {
          userId: score.user.id,
          evaluatorName: score.user.name,
          evaluatorRole: score.user.role,
          roundType: score.round.type,
        });
      }
    }

    const evaluatorAnalytics = Array.from(evaluatorStats.entries())
      .map(([key, stats]) => {
        const meta = evaluatorMeta.get(key);
        if (!meta) {
          return null;
        }

        const bias = Math.round((stats.mean - stats.roundMean) * 100) / 100;
        let biasLabel = "Neutral";
        if (bias <= -5) biasLabel = "Strict";
        if (bias >= 5) biasLabel = "Lenient";

        return {
          ...meta,
          sampleSize: stats.count,
          meanWeightedTotal: Math.round(stats.mean * 100) / 100,
          stdDevWeightedTotal: Math.round(stats.stdDev * 100) / 100,
          roundMeanWeightedTotal: Math.round(stats.roundMean * 100) / 100,
          biasFromRoundMean: bias,
          biasLabel,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .sort((a, b) => {
        if (a.roundType !== b.roundType) {
          return a.roundType.localeCompare(b.roundType);
        }
        return a.evaluatorName.localeCompare(b.evaluatorName);
      });

    if (format === "csv") {
      const header =
        "Normalized Rank,Raw Rank,Rank Delta,Team No,Team Name,Leader,MENTOR_1_RAW,MENTOR_2_RAW,JUDGING_RAW,RAW_FINAL,MENTOR_1_NORMALIZED,MENTOR_2_NORMALIZED,JUDGING_NORMALIZED,NORMALIZED_FINAL,Evaluators";

      const rows = leaderboard.map((entry) => {
        const rawM1 = entry.rawRoundDetails.MENTOR_1 ?? 0;
        const rawM2 = entry.rawRoundDetails.MENTOR_2 ?? 0;
        const rawJudging = entry.rawRoundDetails.JUDGING ?? 0;
        const normM1 = entry.normalizedRoundDetails.MENTOR_1 ?? 0;
        const normM2 = entry.normalizedRoundDetails.MENTOR_2 ?? 0;
        const normJudging = entry.normalizedRoundDetails.JUDGING ?? 0;

        return [
          entry.normalizedRank,
          entry.rawRank,
          entry.rankDelta,
          entry.teamNumber,
          '"' + entry.teamName.replace(/"/g, '""') + '"',
          '"' + entry.leaderName.replace(/"/g, '""') + '"',
          rawM1,
          rawM2,
          rawJudging,
          entry.rawFinalScore,
          normM1,
          normM2,
          normJudging,
          entry.normalizedFinalScore,
          entry.totalEvaluators,
        ].join(",");
      });

      const csv = header + "\n" + rows.join("\n");
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition":
            'attachment; filename="hackmol7-leaderboard-normalized.csv"',
        },
      });
    }

    return NextResponse.json({
      leaderboard,
      evaluatorAnalytics,
      meta: {
        normalization: "z-score-clamped",
        clampRange: [-2, 2],
        neutralFallbackWhenStdZero: 50,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}