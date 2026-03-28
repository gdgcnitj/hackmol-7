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

    const round = await prisma.$transaction(async (tx) => {
      if (isActive === true) {
        const targetRound = await tx.round.findUnique({
          where: { id },
          select: { id: true, isActive: true },
        });

        if (!targetRound) {
          throw new Error("ROUND_NOT_FOUND");
        }

        if (!targetRound.isActive) {
          const activeRound = await tx.round.findFirst({
            where: {
              id: { not: id },
              isActive: true,
            },
            select: { name: true, isLocked: true },
          });

          if (activeRound && !activeRound.isLocked) {
            throw new Error(`LOCK_ACTIVE_ROUND:${activeRound.name}`);
          }
        }

        await tx.round.updateMany({
          where: {
            id: { not: id },
            isActive: true,
          },
          data: { isActive: false },
        });
      }

      if (isActive === false) {
        const targetRound = await tx.round.findUnique({
          where: { id },
          select: { id: true, isActive: true },
        });

        if (!targetRound) {
          throw new Error("ROUND_NOT_FOUND");
        }

        if (targetRound.isActive) {
          const otherActiveCount = await tx.round.count({
            where: {
              id: { not: id },
              isActive: true,
            },
          });

          if (otherActiveCount === 0) {
            throw new Error("AT_LEAST_ONE_ACTIVE_ROUND");
          }
        }
      }

      return tx.round.update({
        where: { id },
        data,
      });
    });

    return NextResponse.json(round);
  } catch (error) {
    if (error instanceof Error && error.message === "ROUND_NOT_FOUND") {
      return NextResponse.json({ error: "Round not found" }, { status: 404 });
    }

    if (
      error instanceof Error &&
      error.message.startsWith("LOCK_ACTIVE_ROUND:")
    ) {
      const activeRoundName = error.message.replace("LOCK_ACTIVE_ROUND:", "");
      return NextResponse.json(
        {
          error: `Lock ${activeRoundName} before activating another round`,
        },
        { status: 409 }
      );
    }

    if (error instanceof Error && error.message === "AT_LEAST_ONE_ACTIVE_ROUND") {
      return NextResponse.json(
        { error: "At least one round must remain active" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
