import { NextRequest, NextResponse } from "next/server";
import { parseRound2LeaderboardCsv, readPublicCsv } from "@/lib/resultCsv";

export async function GET(request: NextRequest) {
  try {
    const csvText = await readPublicCsv("round-2.csv");
    const allEntries = parseRound2LeaderboardCsv(csvText);

    const { searchParams } = new URL(request.url);
    const teamNoFilter = searchParams.get("team_no")?.trim().toUpperCase();

    const entries = teamNoFilter
      ? allEntries.filter((entry) => entry.teamNo.toUpperCase() === teamNoFilter)
      : allEntries;

    return NextResponse.json({
      round: "round-2",
      total: entries.length,
      data: entries,
    });
  } catch {
    return NextResponse.json(
      { error: "Round 2 result CSV is unavailable" },
      { status: 500 }
    );
  }
}
