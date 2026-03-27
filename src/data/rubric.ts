export interface Criterion {
  key: string;
  label: string;
  weight: number;
  maxWeighted: number;
  description: string;
}

export const CRITERIA: Criterion[] = [
  {
    key: "technical",
    label: "Technical Implementation",
    weight: 2.5,
    maxWeighted: 25,
    description:
      "Code quality, architecture, tech-stack choices, complexity and completeness.",
  },
  {
    key: "innovation",
    label: "Innovation / Originality",
    weight: 2.5,
    maxWeighted: 25,
    description:
      "Novelty of idea, creative problem-solving, differentiation from existing solutions.",
  },
  {
    key: "impact",
    label: "Real-world Impact",
    weight: 2.0,
    maxWeighted: 20,
    description:
      "Practical applicability, scalability, how effectively it addresses a real need.",
  },
  {
    key: "demo",
    label: "Demo / Working Product",
    weight: 2.0,
    maxWeighted: 20,
    description:
      "Functionality of live demo, prototype completeness, reliability during presentation.",
  },
  {
    key: "presentation",
    label: "Presentation Clarity",
    weight: 1.0,
    maxWeighted: 10,
    description:
      "Clarity of explanation, slide/pitch quality, confident Q&A handling.",
  },
];

export const ROUND_WEIGHTS = {
  MENTOR_1: 20,
  MENTOR_2: 20,
  JUDGING: 60,
} as const;

export const MAX_SCORE_PER_CRITERION = 10;
export const MAX_WEIGHTED_TOTAL = 100;
