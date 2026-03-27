import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const rounds = await prisma.round.findMany({
      orderBy: { weight: "asc" },
      include: {
        _count: {
          select: {
            assignments: true,
            scores: true,
          },
        },
      },
    });
    return NextResponse.json(rounds);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, isActive, isLocked } = body;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { error: "Round id is required" },
        { status: 400 }
      );
    }

    const data: Record<string, boolean> = {};
    if (typeof isActive === "boolean") data.isActive = isActive;
    if (typeof isLocked === "boolean") data.isLocked = isLocked;

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    const round = await prisma.round.update({
      where: { id },
      data,
    });

    return NextResponse.json(round);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
