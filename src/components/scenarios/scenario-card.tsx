"use client";

import Link from "next/link";
import { getCloudProvider } from "@/data/cloud-providers";
import { getLearningModule } from "@/data/learning-tracks";
import { useScenarioProgress } from "@/hooks/use-scenario-progress";
import {
  getScenarioStatus,
  scenarioDifficultyLabels,
  scenarioStatusLabels,
} from "@/lib/scenario-dashboard";
import type { ScenarioDefinition } from "@/types/scenario";
import type { ScenarioAttemptProgress } from "@/types/scenario-progress";

export function ScenarioCard({ scenario }: { scenario: ScenarioDefinition }) {
  const { progress, isHydrated } = useScenarioProgress();
  return (
    <ScenarioCardView
      scenario={scenario}
      saved={progress.scenarios[scenario.slug]}
      isHydrated={isHydrated}
    />
  );
}

export function ScenarioCardView({
  scenario,
  saved,
  isHydrated,
}: {
  scenario: ScenarioDefinition;
  saved?: ScenarioAttemptProgress;
  isHydrated: boolean;
}) {
  const provider = getCloudProvider(scenario.providerId as Parameters<typeof getCloudProvider>[0]);
  const modules = scenario.relatedModuleIds.map((id) => getLearningModule(id as Parameters<typeof getLearningModule>[0])?.name).filter(Boolean);
  const status = getScenarioStatus(saved);
  const actionLabel =
    status === "completed"
      ? "Powtórz scenariusz"
      : status === "in-progress"
        ? "Spróbuj ponownie"
        : "Rozpocznij scenariusz";

  return (
    <article className="flex h-full flex-col rounded-2xl border border-sky-400/25 bg-gradient-to-br from-sky-400/[0.08] to-indigo-400/[0.04] p-6 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-sky-300">{provider?.shortName ?? scenario.providerId}</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">{scenario.title}</h2>
        </div>
        <span className="rounded-full border border-white/15 px-3 py-1 text-xs font-semibold text-slate-300">{scenarioDifficultyLabels[scenario.difficulty]}</span>
      </div>
      <p className="mt-4 grow text-sm leading-6 text-slate-300">{scenario.summary}</p>
      <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
        <div><dt className="text-slate-500">Szacowany czas</dt><dd className="mt-1 text-slate-200">około {scenario.estimatedMinutes} min</dd></div>
        <div><dt className="text-slate-500">Powiązane moduły</dt><dd className="mt-1 text-slate-200">{modules.join(", ")}</dd></div>
      </dl>
      <div className="mt-6 rounded-xl border border-white/10 bg-black/10 p-4" aria-live="polite">
        {!isHydrated ? <p className="text-sm text-slate-400">Wczytywanie statusu…</p> : saved ? (
          <div className="grid gap-2 text-sm sm:grid-cols-3">
            <p><span className="block text-xs text-slate-500">Status</span><span className={status === "completed" ? "text-emerald-300" : "text-amber-300"}>{scenarioStatusLabels[status]}</span></p>
            <p><span className="block text-xs text-slate-500">Najlepszy wynik</span><span className="text-slate-200">{saved.bestScore}/{saved.totalQuestions}</span></p>
            <p><span className="block text-xs text-slate-500">Podejścia</span><span className="text-slate-200">{saved.attempts}</span></p>
          </div>
        ) : <p className="text-sm text-slate-400">Status: Nierozpoczęty · Najlepszy wynik: — · Podejścia: 0</p>}
      </div>
      <Link href={`/scenarios/${scenario.slug}`} className="mt-6 inline-flex w-fit rounded-lg bg-sky-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400">
        {actionLabel}
      </Link>
    </article>
  );
}
