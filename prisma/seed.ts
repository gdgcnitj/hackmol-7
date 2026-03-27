import "dotenv/config";
import { readFileSync } from "fs";
import { resolve } from "path";
import { hash } from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

interface TeamRow {
  teamNumber: string;
  teamName: string;
  leaderName: string;
}

function parseCSV(filePath: string): TeamRow[] {
  const raw = readFileSync(filePath, "utf-8");
  const lines = raw.split("\n").map((l) => l.trim()).filter(Boolean);
  const teams: TeamRow[] = [];

  let inSelected = false;

  for (const line of lines) {
    if (line.startsWith("Selected Teams")) {
      inSelected = true;
      continue;
    }
    if (line.startsWith("Waitlisted Teams")) {
      break;
    }
    if (line.startsWith("Team No.")) {
      continue;
    }
    if (!inSelected) {
      continue;
    }

    const parts = line.split(",");
    if (parts.length < 3) continue;

    const teamNumber = parts[0].trim();
    const teamName = parts[1].trim();
    const leaderName = parts[2].trim();

    if (!teamNumber.startsWith("H7")) continue;

    teams.push({ teamNumber, teamName, leaderName });
  }

  return teams;
}

async function main() {
  console.log("Starting seed...");

  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminUsername || !adminPassword) {
    throw new Error(
      "ADMIN_USERNAME and ADMIN_PASSWORD must be set in environment"
    );
  }

  // Seed admin user
  const existingAdmin = await prisma.user.findUnique({
    where: { username: adminUsername },
  });

  if (!existingAdmin) {
    const passwordHash = await hash(adminPassword, 12);
    await prisma.user.create({
      data: {
        username: adminUsername,
        name: "HackMol Admin",
        passwordHash,
        role: "ADMIN",
        inviteUsed: true,
        isActive: true,
      },
    });
    console.log("Admin user created: " + adminUsername);
  } else {
    console.log("Admin user already exists, skipping.");
  }

  // Seed rounds
  const rounds = [
    { name: "Mentoring Round 1", type: "MENTOR_1" as const, weight: 20 },
    { name: "Mentoring Round 2", type: "MENTOR_2" as const, weight: 20 },
    { name: "Judging Round", type: "JUDGING" as const, weight: 60 },
  ];

  for (const round of rounds) {
    const existing = await prisma.round.findUnique({
      where: { type: round.type },
    });
    if (!existing) {
      await prisma.round.create({ data: round });
      console.log("Round created: " + round.name);
    } else {
      console.log("Round already exists: " + round.name + ", skipping.");
    }
  }

  // Seed teams from CSV
  const csvPath = resolve(__dirname, "../public/result/result.csv");
  const teams = parseCSV(csvPath);
  console.log("Parsed " + teams.length + " teams from CSV");

  let created = 0;
  let skipped = 0;

  for (const team of teams) {
    const existing = await prisma.team.findUnique({
      where: { teamNumber: team.teamNumber },
    });
    if (!existing) {
      await prisma.team.create({ data: team });
      created++;
    } else {
      skipped++;
    }
  }

  console.log("Teams created: " + created + ", skipped: " + skipped);
  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
