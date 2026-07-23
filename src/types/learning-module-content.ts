import type { CloudProviderId, LearningModuleId, LearningModuleSlug, LearningTrackId } from "@/types/learning-catalog";

export type LearningModuleContent = {
  id: LearningModuleId;
  providerId: CloudProviderId;
  trackId: LearningTrackId;
  slug: LearningModuleSlug;
  name: string;
  shortDescription: string;
  category: string;
  icon: string;
  definition: string;
  learningObjectives: string[];
  concepts: Array<{ name: string; description: string }>;
  useCases: string[];
  commonMistakes: string[];
  summary: string[];
  sections?: Array<{
    id?: string;
    title: string;
    paragraphs: string[];
    items?: Array<{ name: string; description: string }>;
    flow?: string[];
    codeExample?: {
      language: string;
      code: string;
      caption?: string;
    };
  }>;
};
