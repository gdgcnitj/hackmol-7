import type { Role, RoundType } from "@/generated/prisma";

export function canRoleAccessRound(role: Role, roundType: RoundType): boolean {
  if (role === "ADMIN") return true;

  if (role === "MENTOR") {
    return roundType === "MENTOR_1" || roundType === "MENTOR_2";
  }

  if (role === "JUDGE") {
    return roundType === "JUDGING";
  }

  return false;
}

export function getAllowedRoundTypesByRole(role: Role): RoundType[] {
  if (role === "ADMIN") {
    return ["MENTOR_1", "MENTOR_2", "JUDGING"];
  }

  if (role === "MENTOR") {
    return ["MENTOR_1", "MENTOR_2"];
  }

  if (role === "JUDGE") {
    return ["JUDGING"];
  }

  return [];
}
