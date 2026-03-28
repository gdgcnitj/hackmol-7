import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { randomUUID } from "crypto";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      where: { role: { in: ["JUDGE", "MENTOR"] } },
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        inviteToken: true,
        inviteUsed: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(users);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, name, password, role } = body;

    if (!username || !name || !password || !role) {
      return NextResponse.json(
        { error: "username, name, password, and role are required" },
        { status: 400 }
      );
    }

    if (
      typeof username !== "string" ||
      typeof name !== "string" ||
      typeof password !== "string" ||
      typeof role !== "string"
    ) {
      return NextResponse.json(
        { error: "Invalid input types" },
        { status: 400 }
      );
    }

    if (role !== "JUDGE" && role !== "MENTOR") {
      return NextResponse.json(
        { error: "Role must be JUDGE or MENTOR" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({
      where: { username: username.trim() },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Username already taken" },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const inviteToken = randomUUID() + "-" + randomUUID();

    const user = await prisma.user.create({
      data: {
        username: username.trim(),
        name: name.trim(),
        passwordHash,
        role,
        inviteToken,
        inviteUsed: false,
        isActive: true,
      },
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        inviteToken: true,
        inviteUsed: true,
        isActive: true,
        createdAt: true,
      },
    });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const inviteLink = baseUrl + "/auth/invite/" + inviteToken;

    return NextResponse.json({ ...user, inviteLink }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
