import type { ScenarioDefinition, ScenarioDifficulty } from "@/types/scenario";
import type { ScenarioAttemptProgress, ScenarioProgress } from "@/types/scenario-progress";

export type ScenarioStatus = "not-started" | "in-progress" | "completed";
export type ScenarioStatusFilter = "all" | ScenarioStatus;
export type ScenarioDifficultyFilter = "all" | ScenarioDifficulty;
export type ScenarioSort =
  | "recommended"
  | "not-started-first"
  | "in-progress-first"
  | "completed-first"
  | "difficulty"
  | "duration";

export type ScenarioFilters = {
  status: ScenarioStatusFilter;
  difficulty: ScenarioDifficultyFilter;
  moduleId: "all" | string;
};

export const scenarioStatusLabels: Record<ScenarioStatus, string> = {
  "not-started": "Nierozpoczęty",
  "in-progress": "Rozpoczęty",
  completed: "Ukończony",
};

export const scenarioDifficultyLabels: Record<ScenarioDifficulty, string> = {
  beginner: "Początkujący",
  intermediate: "Średniozaawansowany",
  advanced: "Zaawansowany",
};

export function getScenarioStatus(attempt?: ScenarioAttemptProgress): ScenarioStatus {
  if (!attempt || attempt.attempts < 1) return "not-started";
  return attempt.completed ? "completed" : "in-progress";
}

export function getScenarioDashboardStats(
  scenarios: readonly ScenarioDefinition[],
  progress: ScenarioProgress,
) {
  const attempts = scenarios
    .map((scenario) => progress.scenarios[scenario.slug])
    .filter((attempt): attempt is ScenarioAttemptProgress => Boolean(attempt));
  const completed = scenarios.filter(
    (scenario) => getScenarioStatus(progress.scenarios[scenario.slug]) === "completed",
  ).length;
  const total = scenarios.length;
  const averageBestScore = attempts.length
    ? Math.round(
        attempts.reduce(
          (sum, attempt) =>
            sum + (attempt.totalQuestions > 0 ? attempt.bestScore / attempt.totalQuestions : 0),
          0,
        ) /
          attempts.length *
          100,
      )
    : 0;

  return {
    completed,
    total,
    percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    totalAttempts: attempts.reduce((sum, attempt) => sum + attempt.attempts, 0),
    averageBestScore,
    allCompleted: total > 0 && completed === total,
  };
}

export function getRecommendedScenario(
  scenarios: readonly ScenarioDefinition[],
  progress: ScenarioProgress,
) {
  return (
    scenarios.find(
      (scenario) => getScenarioStatus(progress.scenarios[scenario.slug]) === "not-started",
    ) ??
    scenarios.find(
      (scenario) => getScenarioStatus(progress.scenarios[scenario.slug]) === "in-progress",
    )
  );
}

export function getLastScenarioCompletionDate(
  scenarios: readonly ScenarioDefinition[],
  progress: ScenarioProgress,
) {
  const dates = scenarios
    .map((scenario) => progress.scenarios[scenario.slug]?.completedAt)
    .filter((date): date is string => Boolean(date))
    .sort((a, b) => Date.parse(b) - Date.parse(a));
  return dates[0];
}

export function filterScenarios(
  scenarios: readonly ScenarioDefinition[],
  progress: ScenarioProgress,
  filters: ScenarioFilters,
) {
  return scenarios.filter((scenario) => {
    const statusMatches =
      filters.status === "all" ||
      getScenarioStatus(progress.scenarios[scenario.slug]) === filters.status;
    const difficultyMatches =
      filters.difficulty === "all" || scenario.difficulty === filters.difficulty;
    const moduleMatches =
      filters.moduleId === "all" || scenario.relatedModuleIds.includes(filters.moduleId);
    return statusMatches && difficultyMatches && moduleMatches;
  });
}

export function sortScenarios(
  scenarios: readonly ScenarioDefinition[],
  progress: ScenarioProgress,
  sort: ScenarioSort,
) {
  const statusRank: Record<ScenarioStatus, number> = {
    "not-started": 0,
    "in-progress": 1,
    completed: 2,
  };
  const difficultyRank: Record<ScenarioDifficulty, number> = {
    beginner: 0,
    intermediate: 1,
    advanced: 2,
  };
  const copy = [...scenarios];

  if (sort === "duration") {
    return copy.sort((a, b) => a.estimatedMinutes - b.estimatedMinutes);
  }
  if (sort === "difficulty") {
    return copy.sort((a, b) => difficultyRank[a.difficulty] - difficultyRank[b.difficulty]);
  }

  const preferredStatus: ScenarioStatus =
    sort === "in-progress-first"
      ? "in-progress"
      : sort === "completed-first"
        ? "completed"
        : "not-started";

  return copy.sort((a, b) => {
    const aStatus = getScenarioStatus(progress.scenarios[a.slug]);
    const bStatus = getScenarioStatus(progress.scenarios[b.slug]);
    if (sort === "recommended") return statusRank[aStatus] - statusRank[bStatus];
    return Number(bStatus === preferredStatus) - Number(aStatus === preferredStatus);
  });
}

export function getScenariosRelatedToModule(
  scenarios: readonly ScenarioDefinition[],
  moduleId: string,
  limit = 3,
) {
  return scenarios.filter((scenario) => scenario.relatedModuleIds.includes(moduleId)).slice(0, limit);
}
