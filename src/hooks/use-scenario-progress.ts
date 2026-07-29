"use client";

import { useSyncExternalStore } from "react";
import {
  getScenarioProgressSnapshot,
  parseScenarioProgress,
  subscribeToScenarioProgress,
} from "@/lib/scenario-progress";

export function useScenarioProgress() {
  const rawProgress = useSyncExternalStore<string | null | undefined>(
    subscribeToScenarioProgress,
    getScenarioProgressSnapshot,
    () => undefined,
  );
  return {
    progress: parseScenarioProgress(rawProgress ?? null),
    isHydrated: rawProgress !== undefined,
  };
}
