import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const activeRounds = await prisma.round.findMany({
      where: { isActive: true },
      orderBy: { weight: "asc" },
    });

    if (activeRounds.length === 0) {
      return NextResponse.json({ teams: [], activeRound: null });
    }

    const activeRound = activeRounds[0];

    // Check if there are assignments for this user in this round
    const assignments = await prisma.assignment.findMany({
      where: {
        roundId: activeRound.id,
        userId: session.userId,
      },
      select: { teamId: true },
    });

    let teams;
    if (assignments.length > 0) {
      // Only assigned teams
      const teamIds = assignments.map((a) => a.teamId);
      teams = await prisma.team.findMany({
        where: { id: { in: teamIds } },
        orderBy: { teamNumber: "asc" },
      });
    } else {
      // No assignments: show all teams
      teams = await prisma.team.findMany({
        orderBy: { teamNumber: "asc" },
      });
    }

    // Get this user's scores for active round
    const scores = await prisma.score.findMany({
      where: {
        roundId: activeRound.id,
        userId: session.userId,
      },
      select: { teamId: true },
    });

    const scoredTeamIds = new Set(scores.map((s) => s.teamId));

    const teamsWithStatus = teams.map((team) => ({
      ...team,
      scored: scoredTeamIds.has(team.id),
    }));

    return NextResponse.json({
      teams: teamsWithStatus,
      activeRound: {
        id: activeRound.id,
        name: activeRound.name,
        type: activeRound.type,
        isLocked: activeRound.isLocked,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
