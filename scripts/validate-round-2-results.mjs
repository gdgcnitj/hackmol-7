import { readFile } from "node:fs/promises";
import path from "node:path";

const leaderboardPath = path.join(process.cwd(), "public", "result", "round-2.csv");
const winnersPath = path.join(process.cwd(), "public", "result", "round-2-winners.csv");

const leaderboardHeaders = [
  "rank",
  "team_no",
  "team_name",
  "leader_name",
  "mentor_1_normalized",
  "mentor_2_normalized",
  "judging_normalized",
  "final_normalized",
  "qualification_status",
];

const winnerHeaders = [
  "display_order",
  "category",
  "team_name",
  "team_no",
  "award_type",
  "note",
];

const allowedStatus = new Set(["WINNER", "SELECTED", "WAITLISTED", "PARTICIPATED"]);
const allowedAwardType = new Set(["MAIN_TRACK", "TRACK_WINNER", "SPECIAL_MENTION"]);

function parseCsvLine(rawLine) {
  const values = [];
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
      values.push(current.trim().replace(/^"|"$/g, ""));
      current = "";
      continue;
    }

    current += char;
  }

  values.push(current.trim().replace(/^"|"$/g, ""));
  return values;
}

function assertHeaders(actual, expected, fileName) {
  if (actual.length !== expected.length || actual.some((value, index) => value !== expected[index])) {
    throw new Error(`${fileName} has invalid headers. Expected: ${expected.join(", ")}`);
  }
}

async function validateLeaderboard() {
  const raw = await readFile(leaderboardPath, "utf8");
  const lines = raw.split(/\r?\n/).filter((line) => line.trim().length > 0);

  if (lines.length === 0) {
    throw new Error("round-2.csv is empty");
  }

  const headers = parseCsvLine(lines[0]);
  assertHeaders(headers, leaderboardHeaders, "round-2.csv");

  const rankSet = new Set();

  for (const line of lines.slice(1)) {
    const [rank, teamNo, teamName, , m1, m2, judging, finalScore, qualificationStatus] =
      parseCsvLine(line);

    if (!rank || Number.isNaN(Number(rank))) {
      throw new Error(`Invalid rank value: ${rank}`);
    }

    if (rankSet.has(rank)) {
      throw new Error(`Duplicate rank found: ${rank}`);
    }
    rankSet.add(rank);

    if (!teamNo || !teamName) {
      throw new Error(`Missing team_no/team_name on row: ${line}`);
    }

    for (const score of [m1, m2, judging, finalScore]) {
      if (Number.isNaN(Number(score))) {
        throw new Error(`Invalid normalized score value: ${score}`);
      }
    }

    if (!allowedStatus.has((qualificationStatus || "").toUpperCase())) {
      throw new Error(`Invalid qualification_status value: ${qualificationStatus}`);
    }
  }
}

async function validateWinners() {
  const raw = await readFile(winnersPath, "utf8");
  const lines = raw.split(/\r?\n/).filter((line) => line.trim().length > 0);

  if (lines.length === 0) {
    throw new Error("round-2-winners.csv is empty");
  }

  const headers = parseCsvLine(lines[0]);
  assertHeaders(headers, winnerHeaders, "round-2-winners.csv");

  for (const line of lines.slice(1)) {
    const [displayOrder, category, teamName, , awardType] = parseCsvLine(line);

    if (!displayOrder || Number.isNaN(Number(displayOrder))) {
      throw new Error(`Invalid display_order value: ${displayOrder}`);
    }

    if (!category || !teamName) {
      throw new Error(`Missing category/team_name on row: ${line}`);
    }

    if (!allowedAwardType.has((awardType || "").toUpperCase())) {
      throw new Error(`Invalid award_type value: ${awardType}`);
    }
  }
}

try {
  await Promise.all([validateLeaderboard(), validateWinners()]);
  console.log("Round 2 CSV validation passed.");
} catch (error) {
  const message = error instanceof Error ? error.message : "Unknown validation error";
  console.error(`Round 2 CSV validation failed: ${message}`);
  process.exit(1);
}
