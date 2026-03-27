import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { computeWeightedTotal, computeRoundAverage, computeFinalScore } from "@/lib/scoring";
import type { RoundScore } from "@/lib/scoring";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format");

    const teams = await prisma.team.findMany({
      orderBy: { teamNumber: "asc" },
    });

    const rounds = await prisma.round.findMany();

    const scores = await prisma.score.findMany({
      include: {
        round: { select: { type: true, weight: true } },
      },
    });

    const scoresByTeam = new Map<string, typeof scores>();
    for (const score of scores) {
      const existing = scoresByTeam.get(score.teamId) || [];
      existing.push(score);
      scoresByTeam.set(score.teamId, existing);
    }

    const leaderboard = teams.map((team) => {
      const teamScores = scoresByTeam.get(team.id) || [];

      const roundScores: RoundScore[] = rounds.map((round) => {
        const roundTeamScores = teamScores.filter(
          (s) => s.roundId === round.id
        );
        const weightedTotals = roundTeamScores.map((s) =>
          computeWeightedTotal({
            technical: s.technical,
            innovation: s.innovation,
            impact: s.impact,
            demo: s.demo,
            presentation: s.presentation,
          })
        );
        return {
          roundType: round.type,
          roundWeight: round.weight,
          average: computeRoundAverage(weightedTotals),
        };
      });

      const finalScore = computeFinalScore(roundScores);
      const totalJudges = new Set(teamScores.map((s) => s.userId)).size;

      const roundDetails: Record<string, number> = {};
      for (const rs of roundScores) {
        roundDetails[rs.roundType] = rs.average;
      }

      return {
        teamId: team.id,
        teamNumber: team.teamNumber,
        teamName: team.teamName,
        leaderName: team.leaderName,
        finalScore,
        totalJudges,
        roundDetails,
      };
    });

    leaderboard.sort((a, b) => b.finalScore - a.finalScore);

    if (format === "csv") {
      const header =
        "Rank,Team No,Team Name,Leader,MENTOR_1,MENTOR_2,JUDGING,Final Score,Judges";
      const rows = leaderboard.map((entry, i) => {
        const m1 = entry.roundDetails.MENTOR_1 ?? 0;
        const m2 = entry.roundDetails.MENTOR_2 ?? 0;
        const j = entry.roundDetails.JUDGING ?? 0;
        return [
          i + 1,
          entry.teamNumber,
          '"' + entry.teamName.replace(/"/g, '""') + '"',
          '"' + entry.leaderName.replace(/"/g, '""') + '"',
          m1,
          m2,
          j,
          entry.finalScore,
          entry.totalJudges,
        ].join(",");
      });

      const csv = header + "\n" + rows.join("\n");
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition":
            'attachment; filename="hackmol7-leaderboard.csv"',
        },
      });
    }

    return NextResponse.json(leaderboard);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
