import type { Metadata } from "next";
import { ScenariosDashboard } from "@/components/scenarios/scenarios-dashboard";
import { getAllScenarios } from "@/data/scenarios";

export const metadata: Metadata = {
  title: { absolute: "Praktyczne scenariusze | CloudOps Lab" },
  description: "Diagnozuj symulowane incydenty chmurowe, analizuj logi i konfiguracje oraz wybieraj bezpieczne rozwiązania.",
};

export default function ScenariosPage() {
  const scenarios = getAllScenarios();
  return (
    <main className="min-h-[75vh]">
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
          <p className="text-sm font-semibold text-sky-300">CloudOps Lab</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-6xl">Praktyczne scenariusze</h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">Analizuj incydenty, konfiguracje i logi. Znajdź przyczynę problemu, wybierz poprawną naprawę i sprawdź swoje rozumowanie.</p>
        </div>
      </section>
      <ScenariosDashboard scenarios={scenarios} />
    </main>
  );
}
