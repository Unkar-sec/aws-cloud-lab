"use client";

import { ModuleCard } from "@/components/module-card";
import { getModuleStatus, getTrackProgress } from "@/lib/learning-progress";
import type { LearningModuleContent } from "@/types/learning-module-content";
import type { LearningTrackId } from "@/types/learning-catalog";
import { useLearningProgress } from "@/hooks/use-learning-progress";
import { getLearningTrack } from "@/data/learning-tracks";
import { TrackProgress } from "./track-progress";

export function ModuleGrid({ modules, trackId }: { modules: LearningModuleContent[]; trackId: LearningTrackId }) {
  const { progress, isHydrated } = useLearningProgress();
  const track = getLearningTrack(trackId);
  if (!track) return null;
  const trackProgress = getTrackProgress(trackId, progress);

  return <><TrackProgress track={track} {...trackProgress} isLoading={!isHydrated} /><div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{modules.map((learningModule) => <ModuleCard key={learningModule.id} learningModule={learningModule} status={isHydrated ? getModuleStatus(trackId, progress, learningModule.id) : undefined} />)}</div></>;
}
