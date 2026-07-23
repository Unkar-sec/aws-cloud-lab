"use client";

import Link from "next/link";
import { getLearningTrack, getModulesForTrack } from "@/data/learning-tracks";
import { useLearningProgress } from "@/hooks/use-learning-progress";
import { getModuleStatus, getRecommendedModule, getTrackProgress } from "@/lib/learning-progress";
import type { LearningTrackId } from "@/types/learning-catalog";

export function TrackPreview({ trackId }: { trackId: LearningTrackId }) {
  const { progress, isHydrated } = useLearningProgress();
  const track = getLearningTrack(trackId);
  const modules = getModulesForTrack(trackId);
  const recommendedModule = isHydrated ? getRecommendedModule(trackId, progress) : modules[0];
  const trackProgress = getTrackProgress(trackId, progress);
  const trackCompleted = isHydrated && trackProgress.total > 0 && trackProgress.completed === trackProgress.total;
  if (!track) return null;

  return (
    <div id="sciezka" className="overflow-hidden rounded-2xl border border-sky-400/20 bg-gradient-to-br from-sky-400/10 to-indigo-400/5 p-6 sm:p-8">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-sm font-semibold text-sky-300">Aktywna ścieżka</p><h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">{track.name}</h2><p className="mt-2 max-w-2xl text-sm text-slate-300">{track.description}</p>{trackCompleted && <p role="status" className="mt-4 font-semibold text-emerald-300">Ścieżka ukończona</p>}{trackCompleted && <p className="mt-1 text-sm text-slate-300">Praktyczne scenariusze będą kolejnym etapem nauki.</p>}</div>{recommendedModule && <Link href={`/learn/${recommendedModule.slug}`} className="w-fit rounded-lg bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400">{recommendedModule.order === 1 ? `Zacznij od ${recommendedModule.name}` : `Kontynuuj z ${recommendedModule.name}`}</Link>}</div>
      <ol className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">{modules.map((learningModule) => { const status = isHydrated ? getModuleStatus(trackId, progress, learningModule.id) : learningModule.order === 1 ? "recommended" : undefined; return <li key={learningModule.id} className={`rounded-xl border p-4 ${status === "completed" ? "border-emerald-400/40 bg-emerald-400/10" : status === "recommended" ? "border-sky-400/40 bg-sky-400/10" : "border-white/10 bg-black/10"}`}><span className="text-xs text-slate-400">{String(learningModule.order).padStart(2, "0")}</span><p className="mt-3 font-semibold text-white">{learningModule.name}</p><p className="mt-1 text-xs text-slate-300">{status === "completed" ? "Ukończono" : status === "recommended" ? learningModule.order === 1 ? "Start" : "Rekomendowany" : "Następny moduł"}</p></li>; })}</ol>
    </div>
  );
}
