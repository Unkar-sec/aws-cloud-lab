import type { LearningModuleSlug } from "@/types/learning-catalog";

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
  modules: Partial<Record<LearningModuleSlug, ModuleProgress>>;
};
