export type ScenarioDifficulty = "beginner" | "intermediate" | "advanced";

export type ScenarioEvidenceType =
  | "log"
  | "policy"
  | "configuration"
  | "alert"
  | "request"
  | "architecture"
  | "note";

export type ScenarioEvidence = {
  id: string;
  type: ScenarioEvidenceType;
  title: string;
  label: string;
  description?: string;
  language?: string;
  content: string;
};

export type ScenarioAnswer = {
  id: string;
  text: string;
};

export type ScenarioQuestionType = "single-choice";

export type ScenarioQuestion = {
  id: string;
  type: ScenarioQuestionType;
  prompt: string;
  answers: readonly ScenarioAnswer[];
  correctAnswerId: string;
  explanation: string;
  evidenceIds?: readonly string[];
};

export type ScenarioDefinition = {
  id: string;
  slug: string;
  providerId: string;
  trackId?: string;
  title: string;
  summary: string;
  metadataDescription?: string;
  moduleCallout?: string;
  difficulty: ScenarioDifficulty;
  estimatedMinutes: number;
  relatedModuleIds: readonly string[];
  learningObjectives: readonly string[];
  briefing: {
    incidentTitle: string;
    situation: string;
    expectedBehavior: string;
    observedBehavior: string;
    task: string;
  };
  evidence: readonly ScenarioEvidence[];
  questions: readonly ScenarioQuestion[];
  passingScore: number;
  debrief: {
    rootCause: string;
    correctFix: string;
    fixExamples?: readonly ScenarioEvidence[];
    whyItWorks: string;
    unsafeFixes: readonly string[];
    prevention: readonly string[];
  };
};
