"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ScenarioCardView } from "@/components/scenarios/scenario-card";
import { getLearningModule } from "@/data/learning-tracks";
import { useScenarioProgress } from "@/hooks/use-scenario-progress";
import {
  filterScenarios,
  getRecommendedScenario,
  getScenarioDashboardStats,
  scenarioDifficultyLabels,
  sortScenarios,
  type ScenarioDifficultyFilter,
  type ScenarioSort,
  type ScenarioStatusFilter,
} from "@/lib/scenario-dashboard";
import type { ScenarioDefinition } from "@/types/scenario";

const initialFilters = {
  status: "all" as ScenarioStatusFilter,
  difficulty: "all" as ScenarioDifficultyFilter,
  moduleId: "all",
};

export function ScenariosDashboard({ scenarios }: { scenarios: readonly ScenarioDefinition[] }) {
  const { progress, isHydrated } = useScenarioProgress();
  const [filters, setFilters] = useState(initialFilters);
  const [sort, setSort] = useState<ScenarioSort>("recommended");
  const stats = getScenarioDashboardStats(scenarios, progress);
  const recommended = getRecommendedScenario(scenarios, progress);
  const modules = useMemo(
    () =>
      [...new Set(scenarios.flatMap((scenario) => scenario.relatedModuleIds))]
        .map((id) => getLearningModule(id as Parameters<typeof getLearningModule>[0]))
        .filter((module): module is NonNullable<typeof module> => Boolean(module)),
    [scenarios],
  );
  const visibleScenarios = sortScenarios(
    filterScenarios(scenarios, progress, filters),
    progress,
    sort,
  );
  const hasActiveFilters =
    filters.status !== "all" || filters.difficulty !== "all" || filters.moduleId !== "all";

  function clearFilters() {
    setFilters(initialFilters);
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
      <section aria-labelledby="scenario-progress-title" className="rounded-2xl border border-sky-400/20 bg-gradient-to-br from-sky-400/[0.08] to-indigo-400/[0.04] p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-sky-300">Praktyka AWS</p>
            <h2 id="scenario-progress-title" className="mt-2 text-2xl font-semibold text-white">
              {isHydrated ? `Ukończono ${stats.completed} z ${stats.total} scenariuszy` : "Wczytywanie postępu…"}
            </h2>
            {isHydrated && (
              <p className="mt-3 text-sm text-slate-300">
                {stats.allCompleted ? "Cały dostępny zestaw został ukończony." : "Kontynuuj praktykę i rozwijaj umiejętności diagnostyczne."}
              </p>
            )}
          </div>
          {isHydrated && stats.allCompleted && (
            <Link href="/scenarios/completed" className="rounded-lg bg-sky-400 px-5 py-3 text-center text-sm font-semibold text-slate-950 transition hover:bg-sky-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400">
              Zobacz podsumowanie
            </Link>
          )}
        </div>
        <div className="mt-7 h-3 overflow-hidden rounded-full border border-white/10 bg-[#07101f]" role="progressbar" aria-label="Postęp praktycznych scenariuszy" aria-valuemin={0} aria-valuemax={stats.total} aria-valuenow={isHydrated ? stats.completed : 0} aria-valuetext={isHydrated ? `${stats.percentage}%` : "Wczytywanie"}>
          <div className="h-full rounded-full bg-gradient-to-r from-sky-400 to-indigo-400 transition-[width]" style={{ width: `${isHydrated ? stats.percentage : 0}%` }} />
        </div>
        <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-3">
          <div><dt className="text-slate-500">Postęp</dt><dd className="mt-1 font-mono text-lg text-white">{isHydrated ? `${stats.percentage}%` : "—"}</dd></div>
          <div><dt className="text-slate-500">Łączna liczba podejść</dt><dd className="mt-1 font-mono text-lg text-white">{isHydrated ? stats.totalAttempts : "—"}</dd></div>
          <div><dt className="text-slate-500">Średni najlepszy wynik</dt><dd className="mt-1 font-mono text-lg text-white">{isHydrated ? `${stats.averageBestScore}%` : "—"}</dd></div>
        </dl>
      </section>

      {isHydrated && (recommended ? (
        <section aria-labelledby="recommended-scenario-title" className="mt-8 rounded-2xl border border-indigo-400/25 bg-indigo-400/[0.06] p-6 sm:p-8">
          <p className="text-sm font-semibold text-indigo-300">Rekomendowany następny scenariusz</p>
          <h2 id="recommended-scenario-title" className="mt-2 text-2xl font-semibold text-white">{recommended.title}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">{recommended.summary}</p>
          <p className="mt-4 text-sm text-slate-400">
            {scenarioDifficultyLabels[recommended.difficulty]} · około {recommended.estimatedMinutes} min · {recommended.relatedModuleIds.map((id) => getLearningModule(id as Parameters<typeof getLearningModule>[0])?.name).filter(Boolean).join(", ")}
          </p>
          <Link href={`/scenarios/${recommended.slug}`} className="mt-6 inline-flex rounded-lg bg-indigo-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-indigo-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400">
            Przejdź do scenariusza
          </Link>
        </section>
      ) : (
        <section className="mt-8 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-white">Wszystkie dostępne scenariusze ukończone</h2>
          <p className="mt-3 text-sm text-slate-300">Możesz przejrzeć wyniki całego zestawu lub powtórzyć wybrane ćwiczenie.</p>
        </section>
      ))}

      <section aria-labelledby="scenario-filters-title" className="mt-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="scenario-filters-title" className="text-2xl font-semibold text-white">Dostępne scenariusze</h2>
            <p className="mt-2 text-sm text-slate-400" aria-live="polite">Wyświetlono {visibleScenarios.length} z {scenarios.length} scenariuszy</p>
          </div>
          {hasActiveFilters && <button type="button" onClick={clearFilters} className="rounded-lg border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400">Wyczyść filtry</button>}
        </div>

        <div className="mt-6 grid gap-4 rounded-2xl border border-white/10 bg-white/[0.025] p-5 sm:grid-cols-2 lg:grid-cols-4">
          <FilterSelect label="Status" value={filters.status} onChange={(value) => setFilters((current) => ({ ...current, status: value as ScenarioStatusFilter }))}>
            <option value="all">Wszystkie</option><option value="not-started">Nierozpoczęte</option><option value="in-progress">Rozpoczęte</option><option value="completed">Ukończone</option>
          </FilterSelect>
          <FilterSelect label="Trudność" value={filters.difficulty} onChange={(value) => setFilters((current) => ({ ...current, difficulty: value as ScenarioDifficultyFilter }))}>
            <option value="all">Wszystkie</option><option value="beginner">Początkujący</option><option value="intermediate">Średniozaawansowany</option><option value="advanced">Zaawansowany</option>
          </FilterSelect>
          <FilterSelect label="Moduł" value={filters.moduleId} onChange={(value) => setFilters((current) => ({ ...current, moduleId: value }))}>
            <option value="all">Wszystkie</option>
            {modules.map((module) => <option key={module.id} value={module.id}>{module.name}</option>)}
          </FilterSelect>
          <FilterSelect label="Sortowanie" value={sort} onChange={(value) => setSort(value as ScenarioSort)}>
            <option value="recommended">Rekomendowane</option><option value="not-started-first">Najpierw nierozpoczęte</option><option value="in-progress-first">Najpierw rozpoczęte</option><option value="completed-first">Najpierw ukończone</option><option value="difficulty">Poziom trudności</option><option value="duration">Czas wykonania</option>
          </FilterSelect>
        </div>

        {visibleScenarios.length ? (
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {visibleScenarios.map((scenario) => <ScenarioCardView key={scenario.id} scenario={scenario} saved={progress.scenarios[scenario.slug]} isHydrated={isHydrated} />)}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-dashed border-white/15 p-8 text-center">
            <p className="font-semibold text-white">Brak scenariuszy pasujących do wybranych filtrów.</p>
            <button type="button" onClick={clearFilters} className="mt-5 rounded-lg bg-sky-400 px-5 py-3 text-sm font-semibold text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400">Wyczyść filtry</button>
          </div>
        )}
      </section>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  const id = `scenario-filter-${label.toLowerCase().replaceAll(" ", "-")}`;
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-slate-300">{label}</label>
      <select id={id} value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-lg border border-white/15 bg-[#0b1728] px-3 py-2.5 text-sm text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400">
        {children}
      </select>
    </div>
  );
}
