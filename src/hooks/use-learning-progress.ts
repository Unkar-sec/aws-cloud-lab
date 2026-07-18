"use client";

import { useSyncExternalStore } from "react";
import { getProgressSnapshot, parseLearningProgress, subscribeToProgress } from "@/lib/learning-progress";

export function useLearningProgress() {
  const rawProgress = useSyncExternalStore<string | null | undefined>(subscribeToProgress, getProgressSnapshot, () => undefined);
  return { progress: parseLearningProgress(rawProgress ?? null), isHydrated: rawProgress !== undefined };
}
