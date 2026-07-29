import type { Metadata } from "next";
import { ScenariosCompletion } from "@/components/scenarios/scenarios-completion";
import { getAllScenarios } from "@/data/scenarios";

export const metadata: Metadata = {
  title: { absolute: "Podsumowanie scenariuszy | CloudOps Lab" },
  description: "Sprawdź postęp, wyniki i ukończone praktyczne scenariusze CloudOps Lab.",
};

export default function ScenariosCompletedPage() {
  return <main className="min-h-[75vh]"><ScenariosCompletion scenarios={getAllScenarios()} /></main>;
}
