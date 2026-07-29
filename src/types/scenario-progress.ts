export type ScenarioAttemptProgress = {
  completed: boolean;
  bestScore: number;
  totalQuestions: number;
  attempts: number;
  completedAt?: string;
  lastAttemptAt: string;
};

export type ScenarioProgress = {
  version: 1;
  scenarios: Record<string, ScenarioAttemptProgress>;
};
