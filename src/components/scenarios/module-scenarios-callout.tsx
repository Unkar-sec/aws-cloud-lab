"use client";

import Link from "next/link";
import { useScenarioProgress } from "@/hooks/use-scenario-progress";
import {
  getScenarioStatus,
  scenarioDifficultyLabels,
  scenarioStatusLabels,
} from "@/lib/scenario-dashboard";
import type { ScenarioDefinition } from "@/types/scenario";

type RelatedScenario = Pick<
  ScenarioDefinition,
  "id" | "slug" | "title" | "summary" | "moduleCallout" | "difficulty" | "estimatedMinutes"
>;

export function ModuleScenariosCallout({ scenarios }: { scenarios: readonly RelatedScenario[] }) {
  const { progress, isHydrated } = useScenarioProgress();

  if (scenarios.length === 0) return null;

  return (
    <section aria-labelledby="module-scenarios" className="mt-8 rounded-2xl border border-indigo-400/20 bg-indigo-400/[0.06] p-6 sm:p-8">
      <p className="text-sm font-semibold text-indigo-300">Symulowane scenariusze diagnostyczne</p>
      <h2 id="module-scenarios" className="mt-2 text-2xl font-semibold text-white">Przećwicz w scenariuszu</h2>
      <ul className="mt-5 grid gap-4">
        {scenarios.map((scenario) => (
          <li key={scenario.id}>
            <Link href={`/scenarios/${scenario.slug}`} className="group block rounded-xl border border-white/10 bg-black/10 p-4 transition hover:border-indigo-300/40 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400">
              <span className="font-semibold text-white transition group-hover:text-indigo-200">{scenario.title}</span>
              <span className="mt-2 block text-sm leading-6 text-slate-400">
                {scenario.moduleCallout ?? scenario.summary}
              </span>
              <span className="mt-3 block text-xs text-slate-500">
                {scenarioDifficultyLabels[scenario.difficulty]} · około {scenario.estimatedMinutes} min · Status: {isHydrated ? scenarioStatusLabels[getScenarioStatus(progress.scenarios[scenario.slug])] : "wczytywanie…"}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
