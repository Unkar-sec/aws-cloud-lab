import type { ScenarioEvidence } from "@/types/scenario";

export function EvidenceCard({ evidence, compact = false }: { evidence: ScenarioEvidence; compact?: boolean }) {
  return (
    <article id={`evidence-${evidence.id}`} className="min-w-0 scroll-mt-28 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]">
      <header className="border-b border-white/10 px-4 py-4 sm:px-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-sky-300">{evidence.label}</p>
        <h3 className="mt-1 font-semibold text-white">{evidence.title}</h3>
        {evidence.description && <p className="mt-2 text-sm leading-6 text-slate-400">{evidence.description}</p>}
      </header>
      <pre
        className={`max-w-full overflow-x-auto whitespace-pre p-4 font-mono text-sky-100 focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-sky-400 ${compact ? "text-[11px] leading-5" : "text-xs leading-6 sm:p-5"}`}
        tabIndex={0}
        aria-label={`${evidence.label}: ${evidence.title}`}
      >
        <code className={evidence.language ? `language-${evidence.language}` : undefined}>{evidence.content}</code>
      </pre>
    </article>
  );
}
