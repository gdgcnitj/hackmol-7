import { NextResponse } from "next/server";
import { parseRound2WinnersCsv, readPublicCsv } from "@/lib/resultCsv";

export async function GET() {
  try {
    const csvText = await readPublicCsv("round-2-winners.csv");
    const winners = parseRound2WinnersCsv(csvText);

    return NextResponse.json({
      round: "round-2",
      total: winners.length,
      data: winners,
    });
  } catch {
    return NextResponse.json(
      { error: "Round 2 winners CSV is unavailable" },
      { status: 500 }
    );
  }
}
