import type { LearningProgress, ModuleProgress } from "@/types/learning-progress";
import type { LearningModuleId, LearningModuleSlug, LearningTrackId } from "@/types/learning-catalog";
import { getLearningModule, getModulesForTrack, isLearningModuleSlug } from "@/data/learning-tracks";

// The historical key and slug-based module keys remain unchanged for backward compatibility.
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
    const modules: Partial<Record<LearningModuleSlug, ModuleProgress>> = {};
    for (const [slug, moduleValue] of Object.entries(value.modules)) {
      const parsedModule = parseModuleProgress(moduleValue);
      if (parsedModule && isLearningModuleSlug(slug)) modules[slug] = parsedModule;
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

export function getModuleProgress(progress: LearningProgress, moduleSlug: LearningModuleSlug) {
  return progress.modules[moduleSlug];
}

export function getModuleStorageKey(moduleId: LearningModuleId): LearningModuleSlug {
  const learningModule = getLearningModule(moduleId);
  if (!learningModule) throw new Error(`Unknown learning module: ${moduleId}`);
  return learningModule.slug;
}

export function getTrackProgress(trackId: LearningTrackId, progress: LearningProgress) {
  const modules = getModulesForTrack(trackId);
  const completed = modules.filter((learningModule) => learningModule.quizAvailable && progress.modules[getModuleStorageKey(learningModule.id)]?.completed).length;
  const total = modules.length;
  return { completed, total, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
}

export function getRecommendedModule(trackId: LearningTrackId, progress: LearningProgress) {
  return getModulesForTrack(trackId).find((learningModule) => !learningModule.quizAvailable || !progress.modules[getModuleStorageKey(learningModule.id)]?.completed);
}

export function getModuleStatus(trackId: LearningTrackId, progress: LearningProgress, moduleId: LearningModuleId) {
  const learningModule = getLearningModule(moduleId);
  if (!learningModule || learningModule.trackId !== trackId) return undefined;
  if (learningModule.quizAvailable && progress.modules[getModuleStorageKey(moduleId)]?.completed) return "completed" as const;
  if (getRecommendedModule(trackId, progress)?.id === moduleId) return "recommended" as const;
  return undefined;
}

export function applyCompletedAttempt(progress: LearningProgress, moduleSlug: LearningModuleSlug, score: number, totalQuestions: number, passingScore: number, attemptedAt: string): LearningProgress {
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

export function saveCompletedAttempt(moduleSlug: LearningModuleSlug, score: number, totalQuestions: number, passingScore: number): LearningProgress {
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
