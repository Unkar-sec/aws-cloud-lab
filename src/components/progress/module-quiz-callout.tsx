"use client";

import Link from "next/link";
import { useLearningProgress } from "@/hooks/use-learning-progress";
import { getModuleProgress, getTrackProgress } from "@/lib/learning-progress";
import { getLearningModule, getLearningTrack, getNextLearningModule } from "@/data/learning-tracks";
import type { LearningModuleId } from "@/types/learning-catalog";

type ModuleQuizCalloutProps = {
  moduleId: LearningModuleId;
  passingScore: number;
  totalQuestions: number;
};

export function ModuleQuizCallout({ moduleId, passingScore, totalQuestions }: ModuleQuizCalloutProps) {
  const { progress, isHydrated } = useLearningProgress();
  const learningModule = getLearningModule(moduleId);
  const nextModule = getNextLearningModule(moduleId);
  if (!learningModule) return null;
  const learningTrack = getLearningTrack(learningModule.trackId);
  const moduleProgress = getModuleProgress(progress, learningModule.slug);
  const trackProgress = getTrackProgress(learningModule.trackId, progress);
  const completed = Boolean(moduleProgress?.completed);
  const trackCompleted = trackProgress.total > 0 && trackProgress.completed === trackProgress.total;

  return (
    <section className="rounded-2xl border border-sky-400/20 bg-gradient-to-r from-sky-400/10 to-indigo-400/5 p-6 sm:p-8">
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
        <div>
          <p className="text-sm font-semibold text-sky-300">Następny krok</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Sprawdź swoją wiedzę</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">Ukończ krótki quiz {learningModule.name}. Zdobądź co najmniej {passingScore}/{totalQuestions} punktów, aby zaliczyć moduł.</p>
        </div>
        <div className="min-h-12 shrink-0">
          {!isHydrated ? <div aria-label="Wczytywanie statusu" className="h-10 w-36 animate-pulse rounded-lg bg-white/10" /> : completed ? <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm"><p className="font-semibold text-emerald-300">Ukończono</p><p className="mt-1 text-xs text-slate-400">Najlepszy wynik: {moduleProgress?.bestScore}/{moduleProgress?.totalQuestions}</p><p className="mt-1 text-xs text-slate-400">Liczba podejść: {moduleProgress?.attempts}</p></div> : null}
        </div>
      </div>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link href={`/learn/${learningModule.slug}/quiz`} className="rounded-lg bg-sky-400 px-5 py-3 text-center text-sm font-semibold text-slate-950 transition hover:bg-sky-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400">{completed ? `Powtórz quiz ${learningModule.name}` : `Rozpocznij quiz ${learningModule.name}`}</Link>
        {completed && nextModule && <Link href={`/learn/${nextModule.slug}`} className="rounded-lg border border-white/15 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400">Przejdź do {nextModule.name}</Link>}
      </div>
      {completed && nextModule && <p className="mt-4 text-sm font-semibold text-sky-300">Rekomendowany kolejny moduł: {nextModule.name}</p>}
      {completed && trackCompleted && learningTrack && <p role="status" className="mt-4 text-sm font-semibold text-emerald-300">Ścieżka ukończona — wszystkie moduły {learningTrack.name} zostały ukończone.</p>}
    </section>
  );
}
