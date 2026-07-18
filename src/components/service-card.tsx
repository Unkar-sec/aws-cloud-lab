import Link from "next/link";
import type { AwsService } from "@/types/aws-service";

export function ServiceCard({ service }: { service: AwsService }) {
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.035] p-6 transition duration-300 hover:-translate-y-1 hover:border-sky-400/40 hover:bg-white/[0.06]">
      <div className="mb-6 flex items-start justify-between gap-4">
        <span className="grid size-12 place-items-center rounded-xl border border-sky-400/20 bg-sky-400/10 font-mono font-bold text-sky-300">{service.icon}</span>
        <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">{service.category}</span>
      </div>
      <h3 className="text-xl font-semibold text-white">{service.name}</h3>
      <p className="mt-2 grow text-sm leading-6 text-slate-400">{service.shortDescription}</p>
      <p className="mt-6 text-xs font-medium uppercase tracking-[0.16em] text-slate-500">Poziom: Podstawowy</p>
      <Link href={`/learn/${service.slug}`} className="mt-4 inline-flex items-center gap-2 rounded-lg text-sm font-semibold text-sky-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400">
        Poznaj usługę <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
      </Link>
    </article>
  );
}
