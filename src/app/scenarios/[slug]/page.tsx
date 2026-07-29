import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ScenarioRunner } from "@/components/scenarios/scenario-runner";
import { getScenarioBySlug, getScenarioSlugs } from "@/data/scenarios";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getScenarioSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const scenario = getScenarioBySlug(slug);
  if (!scenario) return {};
  if (scenario.slug === "iam-access-denied") {
    return {
      title: { absolute: "IAM Access Denied | CloudOps Lab" },
      description: "Przeanalizuj symulowany incydent AWS IAM, znajdź przyczynę błędu AccessDenied i wybierz rozwiązanie zgodne z Least Privilege.",
    };
  }
  return {
    title: scenario.title,
    description: scenario.metadataDescription ?? scenario.summary,
  };
}

export default async function ScenarioPage({ params }: PageProps) {
  const { slug } = await params;
  const scenario = getScenarioBySlug(slug);
  if (!scenario) notFound();
  return <ScenarioRunner scenario={scenario} />;
}
