import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

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

    const activeRounds = await prisma.round.findMany({
      where: { isActive: true },
      orderBy: { weight: "asc" },
    });

    if (activeRounds.length === 0) {
      return NextResponse.json({ score: null, activeRound: null });
    }

    const activeRound = activeRounds[0];

    const score = await prisma.score.findUnique({
      where: {
        roundId_userId_teamId: {
          roundId: activeRound.id,
          userId: session.userId,
          teamId,
        },
      },
    });

    return NextResponse.json({
      score,
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
