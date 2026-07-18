"use client";

import { ServiceCard } from "@/components/service-card";
import { countCompletedModules, getModuleProgress } from "@/lib/learning-progress";
import type { AwsService } from "@/types/aws-service";
import { useLearningProgress } from "@/hooks/use-learning-progress";

export function FoundationsServiceGrid({ services }: { services: AwsService[] }) {
  const { progress, isHydrated } = useLearningProgress();
  const iamCompleted = Boolean(getModuleProgress(progress, "iam")?.completed);
  const completedCount = countCompletedModules(progress, ["iam"]);

  return (
    <>
      <div className="mt-7 flex min-h-11 items-center rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3 text-sm">
        {isHydrated ? <p className="font-semibold text-slate-200">AWS Foundations: <span className="text-sky-300">{completedCount}/6 ukończonych modułów</span></p> : <div aria-label="Wczytywanie postępu" className="h-4 w-64 max-w-full animate-pulse rounded bg-white/10" />}
      </div>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => <ServiceCard key={service.slug} service={service} status={isHydrated && iamCompleted ? service.slug === "iam" ? "completed" : service.slug === "s3" ? "recommended" : undefined : undefined} />)}
      </div>
    </>
  );
}
