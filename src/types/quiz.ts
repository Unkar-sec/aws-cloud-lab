import type { CloudProviderId, LearningModuleId, LearningModuleSlug, LearningTrackId } from "@/types/learning-catalog";

export type QuizAnswer = { id: string; text: string };

export type QuizQuestion = {
  id: string;
  question: string;
  answers: QuizAnswer[];
  correctAnswerId: string;
  explanation: string;
};

export type QuizDefinition = {
  id: string;
  providerId: CloudProviderId;
  trackId: LearningTrackId;
  moduleId: LearningModuleId;
  moduleSlug: LearningModuleSlug;
  title: string;
  description: string;
  passingScore: number;
  questions: QuizQuestion[];
};
