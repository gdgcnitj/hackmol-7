import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const teams = await prisma.team.findMany({
      orderBy: { teamNumber: "asc" },
      include: {
        scores: {
          select: {
            id: true,
            roundId: true,
            userId: true,
            technical: true,
            innovation: true,
            impact: true,
            demo: true,
            presentation: true,
            notes: true,
            submittedAt: true,
            user: {
              select: { name: true, role: true },
            },
            round: {
              select: { name: true, type: true },
            },
          },
        },
      },
    });
    return NextResponse.json(teams);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
