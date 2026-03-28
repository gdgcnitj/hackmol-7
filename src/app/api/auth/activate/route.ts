import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { error: "Invite token is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { inviteToken: token.trim() },
    });

    if (!user || !user.isActive) {
      return NextResponse.json(
        { error: "Invalid or expired invite link" },
        { status: 404 }
      );
    }

    if (user.inviteUsed) {
      return NextResponse.json({
        success: true,
        alreadyActivated: true,
        name: user.name,
      });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { inviteUsed: true },
    });

    return NextResponse.json({
      success: true,
      alreadyActivated: false,
      name: user.name,
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
