import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, setSessionCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password, token } = body;

    if (!username || !password || !token) {
      return NextResponse.json(
        { error: "Username, password, and invite token are required" },
        { status: 400 }
      );
    }

    if (
      typeof username !== "string" ||
      typeof password !== "string" ||
      typeof token !== "string"
    ) {
      return NextResponse.json(
        { error: "Invalid input" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { inviteToken: token.trim() },
    });

    if (!user || !user.isActive || !user.inviteUsed) {
      return NextResponse.json(
        { error: "Invalid or expired invite" },
        { status: 401 }
      );
    }

    if (user.username !== username.trim()) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    await setSessionCookie({
      userId: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
    });

    return NextResponse.json({ success: true, name: user.name, role: user.role });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
