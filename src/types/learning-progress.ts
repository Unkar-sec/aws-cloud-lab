export type ModuleProgress = {
  completed: boolean;
  bestScore: number;
  totalQuestions: number;
  attempts: number;
  completedAt?: string;
  lastAttemptAt: string;
};

export type LearningProgress = {
  version: 1;
  modules: Record<string, ModuleProgress>;
};
