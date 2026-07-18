import type { LearningProgress, ModuleProgress } from "@/types/learning-progress";

export const LEARNING_PROGRESS_KEY = "aws-cloud-lab-progress";
export const LEARNING_PROGRESS_EVENT = "aws-cloud-lab-progress-change";

export function createEmptyProgress(): LearningProgress {
  return { version: 1, modules: {} };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isValidIsoDate(value: unknown): value is string {
  return typeof value === "string" && !Number.isNaN(Date.parse(value));
}

function parseModuleProgress(value: unknown): ModuleProgress | null {
  if (!isRecord(value)) return null;
  const { completed, bestScore, totalQuestions, attempts, completedAt, lastAttemptAt } = value;
  if (
    typeof completed !== "boolean" ||
    !Number.isInteger(bestScore) || Number(bestScore) < 0 ||
    !Number.isInteger(totalQuestions) || Number(totalQuestions) < 1 ||
    Number(bestScore) > Number(totalQuestions) ||
    !Number.isInteger(attempts) || Number(attempts) < 1 ||
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

export function parseLearningProgress(raw: string | null): LearningProgress {
  if (!raw) return createEmptyProgress();
  try {
    const value: unknown = JSON.parse(raw);
    if (!isRecord(value) || value.version !== 1 || !isRecord(value.modules)) return createEmptyProgress();
    const modules: Record<string, ModuleProgress> = {};
    for (const [slug, moduleValue] of Object.entries(value.modules)) {
      const parsedModule = parseModuleProgress(moduleValue);
      if (parsedModule) modules[slug] = parsedModule;
    }
    return { version: 1, modules };
  } catch {
    return createEmptyProgress();
  }
}

export function readLearningProgress(storage?: Pick<Storage, "getItem">): LearningProgress {
  try {
    const source = storage ?? (typeof window !== "undefined" ? window.localStorage : undefined);
    return source ? parseLearningProgress(source.getItem(LEARNING_PROGRESS_KEY)) : createEmptyProgress();
  } catch {
    return createEmptyProgress();
  }
}

export function getModuleProgress(progress: LearningProgress, moduleSlug: string) {
  return progress.modules[moduleSlug];
}

export function countCompletedModules(progress: LearningProgress, allowedSlugs?: string[]) {
  return Object.entries(progress.modules).filter(([slug, module]) => module.completed && (!allowedSlugs || allowedSlugs.includes(slug))).length;
}

export function applyCompletedAttempt(progress: LearningProgress, moduleSlug: string, score: number, totalQuestions: number, passingScore: number, attemptedAt: string): LearningProgress {
  const previous = progress.modules[moduleSlug];
  const passed = score >= passingScore;
  const completed = Boolean(previous?.completed || passed);
  return {
    version: 1,
    modules: {
      ...progress.modules,
      [moduleSlug]: {
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

export function saveCompletedAttempt(moduleSlug: string, score: number, totalQuestions: number, passingScore: number): LearningProgress {
  const progress = applyCompletedAttempt(readLearningProgress(), moduleSlug, score, totalQuestions, passingScore, new Date().toISOString());
  try {
    window.localStorage.setItem(LEARNING_PROGRESS_KEY, JSON.stringify(progress));
    window.dispatchEvent(new Event(LEARNING_PROGRESS_EVENT));
  } catch {
    // Quiz remains usable when browser storage is unavailable.
  }
  return progress;
}

export function getProgressSnapshot() {
  try { return window.localStorage.getItem(LEARNING_PROGRESS_KEY); } catch { return null; }
}

export function subscribeToProgress(onChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === LEARNING_PROGRESS_KEY) onChange();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(LEARNING_PROGRESS_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(LEARNING_PROGRESS_EVENT, onChange);
  };
}
