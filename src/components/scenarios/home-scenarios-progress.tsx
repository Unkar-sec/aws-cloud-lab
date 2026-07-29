"use client";

import Link from "next/link";
import { useScenarioProgress } from "@/hooks/use-scenario-progress";
import { getRecommendedScenario, getScenarioDashboardStats } from "@/lib/scenario-dashboard";
import type { ScenarioDefinition } from "@/types/scenario";

export function HomeScenariosProgress({ scenarios }: { scenarios: readonly ScenarioDefinition[] }) {
  const { progress, isHydrated } = useScenarioProgress();
  const stats = getScenarioDashboardStats(scenarios, progress);
  const recommended = getRecommendedScenario(scenarios, progress);

  return (
    <div className="mt-8 max-w-4xl rounded-2xl border border-sky-400/20 bg-gradient-to-br from-sky-400/[0.08] to-indigo-400/[0.04] p-6 sm:p-8">
      {!isHydrated ? <p className="text-sm text-slate-400">Wczytywanie postępu scenariuszy…</p> : (
        <>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-sky-300">Ukończono {stats.completed} z {stats.total}</p>
              <h3 className="mt-2 text-2xl font-semibold text-white">{stats.allCompleted ? "Wszystkie dostępne scenariusze ukończone" : recommended ? `Następny: ${recommended.title}` : "Praktyczne scenariusze"}</h3>
              {recommended && !stats.allCompleted && <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">{recommended.summary}</p>}
            </div>
            <span className="font-mono text-2xl font-semibold text-white">{stats.percentage}%</span>
          </div>
          <div className="mt-6 h-3 overflow-hidden rounded-full border border-white/10 bg-[#07101f]" role="progressbar" aria-label={`Postęp scenariuszy: ${stats.percentage}%`} aria-valuemin={0} aria-valuemax={stats.total} aria-valuenow={stats.completed}>
            <div className="h-full rounded-full bg-gradient-to-r from-sky-400 to-indigo-400" style={{ width: `${stats.percentage}%` }} />
          </div>
          <Link href={stats.allCompleted ? "/scenarios/completed" : "/scenarios"} className="mt-6 inline-flex rounded-lg bg-sky-400 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-sky-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400">
            {stats.allCompleted ? "Zobacz podsumowanie" : "Przejdź do scenariuszy"}
          </Link>
        </>
      )}
    </div>
  );
}
