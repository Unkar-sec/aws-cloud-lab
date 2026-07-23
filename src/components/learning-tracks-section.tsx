import Link from "next/link";
import { cloudProviders, getCloudProvider } from "@/data/cloud-providers";
import { AWS_FOUNDATIONS_TRACK_ID, getLearningTrack, getModulesForTrack } from "@/data/learning-tracks";

export function LearningTracksSection() {
  const track = getLearningTrack(AWS_FOUNDATIONS_TRACK_ID)!;
  const provider = getCloudProvider("aws")!;
  const modules = getModulesForTrack(track.id);
  const plannedProviders = cloudProviders.filter((item) => !item.available);

  return (
    <section id="sciezki" className="scroll-mt-20 border-b border-white/10 py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <p className="text-sm font-semibold text-sky-300">Katalog CloudOps Lab</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Wybierz ścieżkę nauki</h2>
        <p className="mt-4 max-w-3xl leading-7 text-slate-300">Zacznij od dostępnej ścieżki AWS. W przyszłości CloudOps Lab będzie rozwijany o kolejne platformy chmurowe i technologie.</p>

        <div className="mt-10 grid gap-5 lg:grid-cols-[1.4fr_0.6fr_0.6fr]">
          <article className="rounded-2xl border border-sky-400/35 bg-gradient-to-br from-sky-400/10 to-indigo-400/5 p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-sm font-semibold text-sky-300">{provider.name}</p><h3 className="mt-2 text-2xl font-semibold text-white">{track.name}</h3></div><span className="rounded-full border border-emerald-400/35 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">Dostępna</span></div>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300">{track.description}</p>
            <p className="mt-6 font-mono text-sm leading-7 text-slate-300">{modules.map(({ name }) => name).join(" → ")}</p>
            <Link href="/learn/iam" className="mt-7 inline-flex rounded-lg bg-sky-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400">Rozpocznij ścieżkę</Link>
          </article>

          {plannedProviders.map((plannedProvider) => <article key={plannedProvider.id} className="rounded-2xl border border-white/10 bg-white/[0.025] p-6"><span className="rounded-full border border-white/15 px-3 py-1 text-xs font-semibold text-slate-300">Planowana</span><h3 className="mt-5 text-lg font-semibold text-white">{plannedProvider.name}</h3><p className="mt-3 text-sm leading-6 text-slate-400">{plannedProvider.description}</p></article>)}
        </div>
      </div>
    </section>
  );
}
