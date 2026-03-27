import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { roundId, userId, teamIds } = body;

    if (!roundId || !userId || !Array.isArray(teamIds)) {
      return NextResponse.json(
        { error: "roundId, userId, and teamIds array are required" },
        { status: 400 }
      );
    }

    if (
      typeof roundId !== "string" ||
      typeof userId !== "string" ||
      !teamIds.every((id: unknown) => typeof id === "string")
    ) {
      return NextResponse.json(
        { error: "Invalid input types" },
        { status: 400 }
      );
    }

    const round = await prisma.round.findUnique({ where: { id: roundId } });
    if (!round) {
      return NextResponse.json(
        { error: "Round not found" },
        { status: 404 }
      );
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.role === "ADMIN") {
      return NextResponse.json(
        { error: "Judge/Mentor not found" },
        { status: 404 }
      );
    }

    const assignments = await prisma.$transaction(
      teamIds.map((teamId: string) =>
        prisma.assignment.upsert({
          where: {
            roundId_userId_teamId: { roundId, userId, teamId },
          },
          create: { roundId, userId, teamId },
          update: {},
        })
      )
    );

    return NextResponse.json({
      success: true,
      count: assignments.length,
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const roundId = searchParams.get("roundId");

    const where = roundId ? { roundId } : {};

    const assignments = await prisma.assignment.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, role: true } },
        team: { select: { id: true, teamNumber: true, teamName: true } },
        round: { select: { id: true, name: true, type: true } },
      },
      orderBy: { team: { teamNumber: "asc" } },
    });

    return NextResponse.json(assignments);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
