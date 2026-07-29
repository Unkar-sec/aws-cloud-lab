import type { ScenarioAttemptProgress, ScenarioProgress } from "@/types/scenario-progress";

export const SCENARIO_PROGRESS_KEY = "cloudops-lab-scenario-progress";
export const SCENARIO_PROGRESS_EVENT = "cloudops-lab-scenario-progress-change";

export function createEmptyScenarioProgress(): ScenarioProgress {
  return { version: 1, scenarios: {} };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isValidIsoDate(value: unknown): value is string {
  return typeof value === "string" && !Number.isNaN(Date.parse(value));
}

function parseAttempt(value: unknown): ScenarioAttemptProgress | null {
  if (!isRecord(value)) return null;
  const { completed, bestScore, totalQuestions, attempts, completedAt, lastAttemptAt } = value;
  if (
    typeof completed !== "boolean" ||
    !Number.isInteger(bestScore) ||
    Number(bestScore) < 0 ||
    !Number.isInteger(totalQuestions) ||
    Number(totalQuestions) < 1 ||
    Number(bestScore) > Number(totalQuestions) ||
    !Number.isInteger(attempts) ||
    Number(attempts) < 1 ||
    !isValidIsoDate(lastAttemptAt) ||
    (completedAt !== undefined && !isValidIsoDate(completedAt)) ||
    (completed && completedAt === undefined)
  ) return null;

  return {
    completed,
    bestScore: Number(bestScore),
    totalQuestions: Number(totalQuestions),
    attempts: Number(attempts),
    lastAttemptAt,
    ...(completedAt ? { completedAt } : {}),
  };
}

export function parseScenarioProgress(raw: string | null): ScenarioProgress {
  if (!raw) return createEmptyScenarioProgress();
  try {
    const value: unknown = JSON.parse(raw);
    if (!isRecord(value) || value.version !== 1 || !isRecord(value.scenarios)) {
      return createEmptyScenarioProgress();
    }
    const scenarios: ScenarioProgress["scenarios"] = {};
    for (const [slug, attempt] of Object.entries(value.scenarios)) {
      const parsed = parseAttempt(attempt);
      if (parsed) scenarios[slug] = parsed;
    }
    return { version: 1, scenarios };
  } catch {
    return createEmptyScenarioProgress();
  }
}

export function readScenarioProgress(storage?: Pick<Storage, "getItem">): ScenarioProgress {
  try {
    const source = storage ?? (typeof window !== "undefined" ? window.localStorage : undefined);
    return source ? parseScenarioProgress(source.getItem(SCENARIO_PROGRESS_KEY)) : createEmptyScenarioProgress();
  } catch {
    return createEmptyScenarioProgress();
  }
}

export function applyScenarioAttempt(
  progress: ScenarioProgress,
  slug: string,
  score: number,
  totalQuestions: number,
  passingScore: number,
  attemptedAt: string,
): ScenarioProgress {
  const previous = progress.scenarios[slug];
  const completed = Boolean(previous?.completed || score >= passingScore);
  return {
    version: 1,
    scenarios: {
      ...progress.scenarios,
      [slug]: {
        completed,
        bestScore: Math.max(previous?.bestScore ?? 0, score),
        totalQuestions,
        attempts: (previous?.attempts ?? 0) + 1,
        lastAttemptAt: attemptedAt,
        ...(completed ? { completedAt: previous?.completedAt ?? attemptedAt } : {}),
      },
    },
  };
}

export function saveScenarioAttempt(slug: string, score: number, totalQuestions: number, passingScore: number) {
  const progress = applyScenarioAttempt(
    readScenarioProgress(),
    slug,
    score,
    totalQuestions,
    passingScore,
    new Date().toISOString(),
  );
  try {
    window.localStorage.setItem(SCENARIO_PROGRESS_KEY, JSON.stringify(progress));
    window.dispatchEvent(new Event(SCENARIO_PROGRESS_EVENT));
  } catch {
    // The local simulation remains usable when browser storage is unavailable.
  }
  return progress;
}

export function getScenarioProgressSnapshot() {
  try {
    return window.localStorage.getItem(SCENARIO_PROGRESS_KEY);
  } catch {
    return null;
  }
}

export function subscribeToScenarioProgress(onChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === SCENARIO_PROGRESS_KEY) onChange();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(SCENARIO_PROGRESS_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(SCENARIO_PROGRESS_EVENT, onChange);
  };
}
