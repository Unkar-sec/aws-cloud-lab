"use client";

import Link from "next/link";
import { useScenarioProgress } from "@/hooks/use-scenario-progress";
import {
  getLastScenarioCompletionDate,
  getScenarioDashboardStats,
  getScenarioStatus,
  scenarioStatusLabels,
} from "@/lib/scenario-dashboard";
import type { ScenarioDefinition } from "@/types/scenario";

export function ScenariosCompletion({ scenarios }: { scenarios: readonly ScenarioDefinition[] }) {
  const { progress, isHydrated } = useScenarioProgress();
  const stats = getScenarioDashboardStats(scenarios, progress);
  const missing = scenarios.filter(
    (scenario) => getScenarioStatus(progress.scenarios[scenario.slug]) !== "completed",
  );
  const lastCompletedAt = getLastScenarioCompletionDate(scenarios, progress);

  if (!isHydrated) {
    return <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-24"><p className="text-slate-300">Wczytywanie postępu scenariuszy…</p></div>;
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-20">
      <nav aria-label="Okruszki" className="text-sm text-slate-500">
        <Link href="/scenarios" className="rounded text-slate-400 hover:text-sky-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400">Praktyczne scenariusze</Link>
        <span aria-hidden="true" className="mx-2">/</span><span>Podsumowanie</span>
      </nav>

      {stats.allCompleted ? (
        <header className="mt-8 rounded-2xl border border-emerald-400/25 bg-gradient-to-br from-emerald-400/[0.09] to-sky-400/[0.05] p-6 sm:p-10">
          <p className="text-sm font-semibold text-emerald-300">Osiągnięcie CloudOps Lab</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-5xl">Zestaw praktycznych scenariuszy ukończony</h1>
          <p className="mt-5 max-w-3xl leading-7 text-slate-300">To osiągnięcie edukacyjne CloudOps Lab, a nie oficjalny certyfikat AWS.</p>
        </header>
      ) : (
        <header className="mt-8 rounded-2xl border border-sky-400/20 bg-sky-400/[0.06] p-6 sm:p-10">
          <p className="text-sm font-semibold text-sky-300">Twój aktualny postęp</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-5xl">Zestaw nie jest jeszcze ukończony</h1>
          <p className="mt-5 max-w-3xl leading-7 text-slate-300">Ukończ brakujące scenariusze, aby odblokować podsumowanie osiągnięcia CloudOps Lab.</p>
        </header>
      )}

      <section aria-labelledby="completion-stats" className="mt-8 rounded-2xl border border-white/10 bg-white/[0.025] p-6 sm:p-8">
        <h2 id="completion-stats" className="text-2xl font-semibold text-white">Podsumowanie wyników</h2>
        <dl className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Ukończone" value={`${stats.completed}/${stats.total}`} />
          <Stat label="Średni najlepszy wynik" value={`${stats.averageBestScore}%`} />
          <Stat label="Łączna liczba podejść" value={String(stats.totalAttempts)} />
          <Stat label="Ostatnie ukończenie" value={lastCompletedAt ? formatDate(lastCompletedAt) : "—"} />
        </dl>
        <div className="mt-6 h-3 overflow-hidden rounded-full border border-white/10 bg-[#07101f]" role="progressbar" aria-label={`Ukończono ${stats.completed} z ${stats.total} scenariuszy`} aria-valuemin={0} aria-valuemax={stats.total} aria-valuenow={stats.completed}>
          <div className="h-full rounded-full bg-gradient-to-r from-sky-400 to-emerald-400" style={{ width: `${stats.percentage}%` }} />
        </div>
      </section>

      {!stats.allCompleted && (
        <section aria-labelledby="missing-scenarios" className="mt-8">
          <h2 id="missing-scenarios" className="text-2xl font-semibold text-white">Brakujące scenariusze</h2>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2">
            {missing.map((scenario) => (
              <li key={scenario.id} className="rounded-xl border border-white/10 bg-white/[0.025] p-5">
                <p className="font-semibold text-white">{scenario.title}</p>
                <p className="mt-2 text-sm text-amber-300">{scenarioStatusLabels[getScenarioStatus(progress.scenarios[scenario.slug])]}</p>
                <Link href={`/scenarios/${scenario.slug}`} className="mt-4 inline-flex rounded text-sm font-semibold text-sky-300 hover:text-sky-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400">Przejdź do scenariusza →</Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {stats.allCompleted && (
        <section aria-labelledby="completed-results" className="mt-8">
          <h2 id="completed-results" className="text-2xl font-semibold text-white">Wyniki scenariuszy</h2>
          <ul className="mt-5 grid gap-4">
            {scenarios.map((scenario) => {
              const saved = progress.scenarios[scenario.slug];
              return (
                <li key={scenario.id} className="flex flex-col gap-4 rounded-xl border border-white/10 bg-white/[0.025] p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div><p className="font-semibold text-white">{scenario.title}</p><p className="mt-1 text-sm text-slate-400">Najlepszy wynik: {saved?.bestScore ?? 0}/{saved?.totalQuestions ?? scenario.questions.length} · Podejścia: {saved?.attempts ?? 0}</p></div>
                  <Link href={`/scenarios/${scenario.slug}`} className="rounded-lg border border-white/15 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400">Powtórz wybrany scenariusz</Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link href="/scenarios" className="rounded-lg bg-sky-400 px-5 py-3 text-center text-sm font-semibold text-slate-950 hover:bg-sky-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400">Wróć do scenariuszy</Link>
        {stats.allCompleted && <Link href="/#sciezka" className="rounded-lg border border-white/15 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400">Wróć do AWS Foundations</Link>}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return <div><dt className="text-sm text-slate-500">{label}</dt><dd className="mt-1 font-mono text-lg text-white">{value}</dd></div>;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pl-PL", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}
