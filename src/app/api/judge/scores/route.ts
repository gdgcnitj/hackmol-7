import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { validateAllScores } from "@/lib/scoring";
import { canRoleAccessRound } from "@/lib/roundAccess";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { teamId, roundId, technical, innovation, impact, demo, presentation, notes } = body;

    if (!teamId || !roundId) {
      return NextResponse.json(
        { error: "teamId and roundId are required" },
        { status: 400 }
      );
    }

    if (typeof teamId !== "string" || typeof roundId !== "string") {
      return NextResponse.json(
        { error: "Invalid input types" },
        { status: 400 }
      );
    }

    const scoreValues = { technical, innovation, impact, demo, presentation };
    const validationError = validateAllScores(scoreValues);
    if (validationError) {
      return NextResponse.json(
        { error: validationError },
        { status: 400 }
      );
    }

    // Verify round exists, is active, and not locked
    const round = await prisma.round.findUnique({ where: { id: roundId } });
    if (!round) {
      return NextResponse.json(
        { error: "Round not found" },
        { status: 404 }
      );
    }
    if (!round.isActive) {
      return NextResponse.json(
        { error: "This round is not currently active" },
        { status: 403 }
      );
    }
    if (!canRoleAccessRound(session.role, round.type)) {
      return NextResponse.json(
        {
          error:
            session.role === "MENTOR"
              ? "Mentors can only score mentoring rounds"
              : "Judges can only score judging round",
        },
        { status: 403 }
      );
    }
    if (round.isLocked) {
      return NextResponse.json(
        { error: "This round is locked and no longer accepting scores" },
        { status: 403 }
      );
    }

    // Verify team exists
    const team = await prisma.team.findUnique({ where: { id: teamId } });
    if (!team) {
      return NextResponse.json(
        { error: "Team not found" },
        { status: 404 }
      );
    }

    // Check if user is assigned to this team (if assignments exist)
    const assignmentCount = await prisma.assignment.count({
      where: { roundId, userId: session.userId },
    });

    if (assignmentCount > 0) {
      const hasAssignment = await prisma.assignment.findUnique({
        where: {
          roundId_userId_teamId: {
            roundId,
            userId: session.userId,
            teamId,
          },
        },
      });
      if (!hasAssignment) {
        return NextResponse.json(
          { error: "You are not assigned to score this team in this round" },
          { status: 403 }
        );
      }
    }

    const sanitizedNotes =
      notes && typeof notes === "string" ? notes.trim().slice(0, 1000) : null;

    const score = await prisma.score.upsert({
      where: {
        roundId_userId_teamId: {
          roundId,
          userId: session.userId,
          teamId,
        },
      },
      create: {
        roundId,
        userId: session.userId,
        teamId,
        technical,
        innovation,
        impact,
        demo,
        presentation,
        notes: sanitizedNotes,
      },
      update: {
        technical,
        innovation,
        impact,
        demo,
        presentation,
        notes: sanitizedNotes,
      },
    });

    return NextResponse.json({ success: true, scoreId: score.id });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
