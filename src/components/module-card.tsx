import Link from "next/link";
import type { LearningModuleContent } from "@/types/learning-module-content";

type ModuleStatus = "completed" | "recommended";

export function ModuleCard({ learningModule, status }: { learningModule: LearningModuleContent; status?: ModuleStatus }) {
  return (
    <Link href={`/learn/${learningModule.slug}`} className={`group block h-full rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400 ${status === "recommended" ? "shadow-[0_0_28px_rgba(56,189,248,0.09)]" : ""}`}>
      <article className={`flex h-full flex-col rounded-2xl border bg-white/[0.035] p-5 transition duration-300 motion-safe:group-hover:-translate-y-1 motion-reduce:transition-none sm:p-6 ${status === "recommended" ? "border-sky-400/40 group-hover:border-sky-300/60 group-hover:bg-sky-400/[0.07]" : status === "completed" ? "border-emerald-400/25 group-hover:border-emerald-400/45 group-hover:bg-emerald-400/[0.045]" : "border-white/10 group-hover:border-sky-400/40 group-hover:bg-white/[0.06]"}`}>
        <div className="mb-5 flex min-w-0 items-start justify-between gap-3 sm:mb-6"><span className="grid size-12 shrink-0 place-items-center rounded-xl border border-sky-400/25 bg-sky-400/10 px-1 font-mono text-xs font-bold text-sky-200">{learningModule.icon}</span><span className="max-w-[65%] break-words rounded-full border border-white/15 bg-white/[0.03] px-3 py-1 text-right text-xs font-medium text-slate-300">{learningModule.category}</span></div>
        <h3 className="text-xl font-semibold text-white">{learningModule.name}</h3>
        {status && <p className={`mt-3 inline-flex w-fit max-w-full items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold leading-4 ${status === "completed" ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-200" : "border-sky-400/40 bg-sky-400/10 text-sky-200"}`}>{status === "completed" && <span aria-hidden="true">✓</span>}<span>{status === "completed" ? "Ukończono" : "Rekomendowany następny moduł"}</span></p>}
        <p className="mt-3 grow text-sm leading-6 text-slate-300">{learningModule.shortDescription}</p>
        <p className="mt-6 text-xs font-medium text-slate-400">Poziom: podstawowy</p>
        <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-sky-200">Poznaj moduł <span aria-hidden="true" className="transition-transform duration-200 motion-safe:group-hover:translate-x-1 motion-reduce:transition-none">→</span></span>
      </article>
    </Link>
  );
}
