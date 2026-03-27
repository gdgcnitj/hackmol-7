import { CRITERIA } from "@/data/rubric";

export interface ScoreInput {
  technical: number;
  innovation: number;
  impact: number;
  demo: number;
  presentation: number;
}

export function computeWeightedTotal(scores: ScoreInput): number {
  let total = 0;
  for (const criterion of CRITERIA) {
    const raw = scores[criterion.key as keyof ScoreInput];
    total += raw * criterion.weight;
  }
  return Math.round(total * 100) / 100;
}

export function computeRoundAverage(weightedTotals: number[]): number {
  if (weightedTotals.length === 0) return 0;
  const sum = weightedTotals.reduce((a, b) => a + b, 0);
  return Math.round((sum / weightedTotals.length) * 100) / 100;
}

export interface RoundScore {
  roundType: "MENTOR_1" | "MENTOR_2" | "JUDGING";
  roundWeight: number;
  average: number;
}

export function computeFinalScore(roundScores: RoundScore[]): number {
  let final = 0;
  for (const rs of roundScores) {
    final += rs.average * (rs.roundWeight / 100);
  }
  return Math.round(final * 100) / 100;
}

export function validateScoreValue(value: number): boolean {
  return Number.isInteger(value) && value >= 0 && value <= 10;
}

export function validateAllScores(scores: ScoreInput): string | null {
  const keys: (keyof ScoreInput)[] = [
    "technical",
    "innovation",
    "impact",
    "demo",
    "presentation",
  ];
  for (const key of keys) {
    if (!validateScoreValue(scores[key])) {
      return `${key} must be an integer between 0 and 10`;
    }
  }
  return null;
}
