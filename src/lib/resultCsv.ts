import { promises as fs } from "node:fs";
import path from "node:path";

export interface Round1Entry {
  teamNo: string;
  teamName: string;
  teamLeaderName: string;
}

type Round1Section = "selected" | "waitlisted";

export interface Round2LeaderboardEntry {
  rank: number;
  teamNo: string;
  teamName: string;
  leaderName: string;
  mentor1Normalized: number;
  mentor2Normalized: number;
  judgingNormalized: number;
  finalNormalized: number;
  qualificationStatus: "WINNER" | "SELECTED" | "WAITLISTED" | "PARTICIPATED";
}

export interface Round2WinnerEntry {
  displayOrder: number;
  category: string;
  teamName: string;
  teamNo: string;
  awardType: "MAIN_TRACK" | "TRACK_WINNER" | "SPECIAL_MENTION";
  note: string;
}

export interface Round2SummaryEntry {
  metric: string;
  value: number;
}

export interface Round2TopTeamEntry {
  rank: number;
  teamNo: string;
  teamName: string;
  leaderName: string;
  finalNormalized: number;
}

function normalizeCsvCell(value: string): string {
  return value.trim().replace(/^"|"$/g, "");
}

function parseCsvLine(rawLine: string): string[] {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < rawLine.length; i += 1) {
    const char = rawLine[i];

    if (char === '"') {
      if (inQuotes && rawLine[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      values.push(normalizeCsvCell(current));
      current = "";
      continue;
    }

    current += char;
  }

  values.push(normalizeCsvCell(current));
  return values;
}

function toNumber(value: string): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export async function readPublicCsv(relativePath: string): Promise<string> {
  const csvPath = path.join(process.cwd(), "public", "result", relativePath);
  return fs.readFile(csvPath, "utf8");
}

export function parseRound1Csv(csvText: string): {
  selected: Round1Entry[];
  waitlisted: Round1Entry[];
} {
  const selected: Round1Entry[] = [];
  const waitlisted: Round1Entry[] = [];
  let currentSection: Round1Section | null = null;

  for (const rawLine of csvText.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;

    const lower = line.toLowerCase();

    if (lower.startsWith("selected teams for offline round")) {
      currentSection = "selected";
      continue;
    }

    if (lower.startsWith("waitlisted teams")) {
      currentSection = "waitlisted";
      continue;
    }

    if (lower.startsWith("team no.,team name,team leader name")) {
      continue;
    }

    if (!currentSection) continue;

    const [teamNo, teamName, ...leaderParts] = parseCsvLine(rawLine);
    const teamLeaderName = leaderParts.join(", ").trim();

    if (!teamNo || !teamName || !teamLeaderName) continue;

    const entry: Round1Entry = {
      teamNo,
      teamName,
      teamLeaderName,
    };

    if (currentSection === "selected") {
      selected.push(entry);
    } else {
      waitlisted.push(entry);
    }
  }

  return { selected, waitlisted };
}

function parseQualificationStatus(value: string): Round2LeaderboardEntry["qualificationStatus"] {
  const normalized = value.trim().toUpperCase();
  if (normalized === "WINNER") return "WINNER";
  if (normalized === "SELECTED") return "SELECTED";
  if (normalized === "WAITLISTED") return "WAITLISTED";
  return "PARTICIPATED";
}

function parseAwardType(value: string): Round2WinnerEntry["awardType"] {
  const normalized = value.trim().toUpperCase();
  if (normalized === "MAIN_TRACK") return "MAIN_TRACK";
  if (normalized === "TRACK_WINNER") return "TRACK_WINNER";
  return "SPECIAL_MENTION";
}

export function parseRound2LeaderboardCsv(csvText: string): Round2LeaderboardEntry[] {
  const lines = csvText.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length <= 1) return [];

  return lines.slice(1).map((line) => {
    const [
      rank,
      teamNo,
      teamName,
      leaderName,
      mentor1Normalized,
      mentor2Normalized,
      judgingNormalized,
      finalNormalized,
      qualificationStatus,
    ] = parseCsvLine(line);

    return {
      rank: toNumber(rank),
      teamNo,
      teamName,
      leaderName,
      mentor1Normalized: toNumber(mentor1Normalized),
      mentor2Normalized: toNumber(mentor2Normalized),
      judgingNormalized: toNumber(judgingNormalized),
      finalNormalized: toNumber(finalNormalized),
      qualificationStatus: parseQualificationStatus(qualificationStatus),
    };
  });
}

export function parseRound2WinnersCsv(csvText: string): Round2WinnerEntry[] {
  const lines = csvText.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length <= 1) return [];

  return lines
    .slice(1)
    .map((line) => {
      const [displayOrder, category, teamName, teamNo, awardType, note] = parseCsvLine(line);
      return {
        displayOrder: toNumber(displayOrder),
        category,
        teamName,
        teamNo,
        awardType: parseAwardType(awardType),
        note,
      };
    })
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

export function parseRound2SummaryCsv(csvText: string): Round2SummaryEntry[] {
  const lines = csvText.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length <= 1) return [];

  return lines.slice(1).map((line) => {
    const [metric, value] = parseCsvLine(line);
    return {
      metric,
      value: toNumber(value),
    };
  });
}

export function parseRound2TopTeamsCsv(csvText: string): Round2TopTeamEntry[] {
  const lines = csvText.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length <= 1) return [];

  return lines.slice(1).map((line) => {
    const [rank, teamNo, teamName, leaderName, finalNormalized] = parseCsvLine(line);
    return {
      rank: toNumber(rank),
      teamNo,
      teamName,
      leaderName,
      finalNormalized: toNumber(finalNormalized),
    };
  });
}
