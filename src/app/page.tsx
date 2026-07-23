import Link from "next/link";
import { LearningStep } from "@/components/learning-step";
import { ModuleGrid } from "@/components/progress/module-grid";
import { TrackPreview } from "@/components/track-preview";
import { LearningTracksSection } from "@/components/learning-tracks-section";
import { awsServices } from "@/data/aws-services";
import { brand } from "@/config/brand";
import { AWS_FOUNDATIONS_TRACK_ID } from "@/data/learning-tracks";

export default function Home() {
  return (
    <main>
      <section className="relative isolate overflow-hidden border-b border-white/10">
        <div className="hero-glow absolute inset-0 -z-10" />
        <div className="mx-auto grid min-h-[690px] max-w-7xl items-center gap-14 px-5 py-24 sm:px-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="mb-6 inline-flex rounded-full border border-sky-400/20 bg-sky-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">{brand.name}</p>
            <h1 className="max-w-3xl text-4xl font-bold tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">Rozwijaj praktyczne<br /><span className="text-gradient">umiejętności chmurowe</span></h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">Poznawaj usługi chmurowe, sprawdzaj swoją wiedzę i przygotowuj się do rozwiązywania realistycznych problemów infrastrukturalnych.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/learn/iam" className="rounded-lg bg-sky-400 px-6 py-3.5 text-center text-sm font-semibold text-slate-950 transition hover:bg-sky-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400">Rozpocznij pierwszą ścieżkę<span className="mt-0.5 block text-xs font-medium text-slate-700">Amazon Web Services</span></Link>
              <Link href="#sciezki" className="rounded-lg border border-white/15 px-6 py-3.5 text-center text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400">Zobacz dostępne ścieżki</Link>
            </div>
            <ul className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm text-slate-400">
              {['Tutoriale krok po kroku', 'Quizy sprawdzające wiedzę', 'Kolejne środowiska w przyszłości'].map((item) => <li key={item} className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-sky-400" />{item}</li>)}
            </ul>
          </div>
          <div aria-hidden="true" className="relative hidden min-h-96 lg:block">
            <div className="absolute inset-8 rounded-full border border-sky-400/20" />
            <div className="absolute inset-20 rounded-full border border-dashed border-white/15" />
            <div className="absolute inset-0 m-auto grid size-32 place-items-center rounded-3xl border border-sky-300/30 bg-sky-400/10 shadow-[0_0_80px_rgba(56,189,248,0.2)]"><span className="font-mono text-3xl font-bold text-sky-300">CO</span></div>
            {awsServices.map((service, index) => <span key={service.slug} className={`orbit-item orbit-${index} grid size-12 place-items-center rounded-xl border border-white/15 bg-[#0d1a2d] font-mono text-xs font-bold text-sky-200`}>{service.icon}</span>)}
          </div>
        </div>
      </section>

      <LearningTracksSection />

      <section id="uslugi" className="scroll-mt-20 py-24">
        <span id="services" className="block scroll-mt-20" aria-hidden="true" />
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <p className="text-sm font-semibold text-sky-300">Pierwsza dostępna ścieżka: AWS</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Podstawowe usługi AWS</h2>
          <p className="mt-4 max-w-2xl leading-7 text-slate-300">Każdy moduł AWS Foundations wyjaśnia najważniejsze pojęcia, zastosowania i typowe problemy.</p>
          <ModuleGrid modules={awsServices} trackId={AWS_FOUNDATIONS_TRACK_ID} />
        </div>
      </section>

      <section id="jak-to-dziala" className="scroll-mt-20 border-y border-white/10 bg-white/[0.02] py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <p className="text-sm font-semibold text-sky-300">Od teorii do praktyki</p>
          <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Jak działa nauka</h2>
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <LearningStep number={1} title="Poznaj usługę" available />
            <LearningStep number={2} title="Sprawdź wiedzę" />
            <LearningStep number={3} title="Rozwiąż scenariusz" />
            <LearningStep number={4} title="Zdobądź osiągnięcie" />
          </ol>
          <p className="mt-7 max-w-3xl text-sm leading-6 text-slate-400">Dostępne są tutoriale oraz quizy IAM, S3, EC2, VPC, Lambda i CloudWatch. Symulowane scenariusze i kolejne formaty nauki pojawią się w następnych etapach rozwoju projektu.</p>
        </div>
      </section>

      <section className="py-24"><div className="mx-auto max-w-7xl px-5 sm:px-8"><TrackPreview trackId={AWS_FOUNDATIONS_TRACK_ID} /></div></section>
    </main>
  );
}
