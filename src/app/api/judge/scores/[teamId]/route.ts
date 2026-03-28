import { NextRequest, NextResponse } from "next/server";
import type { RoundType } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { getAllowedRoundTypesByRole } from "@/lib/roundAccess";

const ROUND_ORDER: Record<RoundType, number> = {
  MENTOR_1: 1,
  MENTOR_2: 2,
  JUDGING: 3,
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ teamId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { teamId } = await params;

    const activeRound = await prisma.round.findFirst({
      where: {
        isActive: true,
        type: {
          in: getAllowedRoundTypesByRole(session.role),
        },
      },
      orderBy: { weight: "asc" },
    });

    if (!activeRound) {
      return NextResponse.json({
        score: null,
        activeRound: null,
        previousRoundNotes: [],
      });
    }

    const score = await prisma.score.findUnique({
      where: {
        roundId_userId_teamId: {
          roundId: activeRound.id,
          userId: session.userId,
          teamId,
        },
      },
    });

    const previousRoundTypes = (Object.keys(ROUND_ORDER) as RoundType[]).filter(
      (type) => ROUND_ORDER[type] < ROUND_ORDER[activeRound.type]
    );

    let previousRoundNotes: {
      id: string;
      notes: string;
      submittedAt: Date;
      user: { name: string; role: string };
      round: { name: string; type: RoundType };
    }[] = [];

    if (previousRoundTypes.length > 0) {
      const previousScores = await prisma.score.findMany({
        where: {
          teamId,
          notes: { not: null },
          round: {
            type: {
              in: previousRoundTypes,
            },
          },
        },
        select: {
          id: true,
          notes: true,
          submittedAt: true,
          user: {
            select: { name: true, role: true },
          },
          round: {
            select: { name: true, type: true },
          },
        },
      });

      previousRoundNotes = previousScores
        .filter((s) => typeof s.notes === "string" && s.notes.trim().length > 0)
        .sort((a, b) => {
          const byRound = ROUND_ORDER[a.round.type] - ROUND_ORDER[b.round.type];
          if (byRound !== 0) return byRound;
          return b.submittedAt.getTime() - a.submittedAt.getTime();
        })
        .map((s) => ({
          id: s.id,
          notes: s.notes as string,
          submittedAt: s.submittedAt,
          user: { name: s.user.name, role: s.user.role },
          round: { name: s.round.name, type: s.round.type },
        }));
    }

    return NextResponse.json({
      score,
      activeRound: {
        id: activeRound.id,
        name: activeRound.name,
        type: activeRound.type,
        isLocked: activeRound.isLocked,
      },
      previousRoundNotes,
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
