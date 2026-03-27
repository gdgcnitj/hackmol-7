import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "hackmol_session";

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not set");
  }
  return new TextEncoder().encode(secret);
}

interface TokenPayload {
  role: string;
}

async function getTokenPayload(
  request: NextRequest
): Promise<TokenPayload | null> {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    return payload as unknown as TokenPayload;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip auth pages and API auth routes
  if (
    pathname.startsWith("/auth/") ||
    pathname.startsWith("/api/auth/") ||
    pathname === "/admin/auth"
  ) {
    return NextResponse.next();
  }

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    const payload = await getTokenPayload(request);
    if (!payload) {
      return NextResponse.redirect(new URL("/admin/auth", request.url));
    }
    if (payload.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/admin/auth", request.url));
    }
    return NextResponse.next();
  }

  // Protect judge routes
  if (pathname.startsWith("/judge")) {
    const payload = await getTokenPayload(request);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (payload.role !== "JUDGE" && payload.role !== "MENTOR") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.next();
  }

  // Protect judge API routes
  if (pathname.startsWith("/api/judge")) {
    const payload = await getTokenPayload(request);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (payload.role !== "JUDGE" && payload.role !== "MENTOR") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.next();
  }

  // Protect admin API routes
  if (pathname.startsWith("/api/admin")) {
    const payload = await getTokenPayload(request);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (payload.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/judge/:path*",
    "/auth/:path*",
    "/api/admin/:path*",
    "/api/judge/:path*",
  ],
};
