import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { awsServices, getService } from "@/data/aws-services";
import { ModuleQuizCallout } from "@/components/progress/module-quiz-callout";
import { getQuizForModule } from "@/data/quizzes";
import { getLearningModule, getLearningTrack, getNextLearningModule } from "@/data/learning-tracks";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return awsServices.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return { title: `${service.name} — tutorial`, description: service.shortDescription };
}

export default async function ServiceTutorial({ params }: PageProps) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();
  const learningModule = getLearningModule(service.id);
  if (!learningModule) notFound();
  const track = getLearningTrack(learningModule.trackId);
  const nextLearningModule = getNextLearningModule(learningModule.id);
  const nextService = nextLearningModule ? getService(nextLearningModule.slug) : null;
  const quiz = getQuizForModule(service.slug);

  return (
    <main className="min-h-[75vh]">
      <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-20">
        <nav aria-label="Okruszki" className="text-sm text-slate-500">
          <Link href="/#sciezka" className="rounded text-slate-400 hover:text-sky-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400">{track?.name}</Link>
          <span aria-hidden="true" className="mx-2">/</span><span>{service.name}</span>
        </nav>

        <header className="mt-8 border-b border-white/10 pb-12">
          <div className="flex items-center gap-4">
            <span className="grid size-14 place-items-center rounded-xl border border-sky-400/20 bg-sky-400/10 font-mono font-bold text-sky-300">{service.icon}</span>
            <div><p className="text-sm font-semibold text-sky-300">{service.category}</p><h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">{service.name}</h1></div>
          </div>
          <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-300">{service.definition}</p>
        </header>

        <section aria-labelledby="learning-objectives" className="mt-10 rounded-2xl border border-sky-400/20 bg-sky-400/[0.06] p-6 sm:p-8">
          <h2 id="learning-objectives" className="text-2xl font-semibold text-white">Po ukończeniu tego modułu potrafisz:</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {service.learningObjectives.map((objective) => <li key={objective} className="flex gap-3 text-sm leading-6 text-slate-300"><span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-sky-300" />{objective}</li>)}
          </ul>
        </section>

        {service.sections && service.sections.length > 0 && <nav aria-labelledby="table-of-contents" className="mt-8 rounded-2xl border border-white/10 bg-white/[0.025] p-6">
          <h2 id="table-of-contents" className="text-lg font-semibold text-white">W tym module</h2>
          <ol className="mt-4 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
            {service.sections.map((section, index) => <li key={section.id ?? section.title}><a href={`#${section.id ?? `${service.slug}-section-${index + 1}`}`} className="rounded text-slate-300 transition hover:text-sky-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400">{index + 1}. {section.title}</a></li>)}
          </ol>
        </nav>}

        <div className="grid gap-12 py-12 lg:grid-cols-[1.25fr_0.75fr]">
          <section>
            <h2 className="text-2xl font-semibold text-white">Najważniejsze pojęcia</h2>
            <dl className="mt-6 divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/[0.025] px-6">
              {service.concepts.map((concept) => <div key={concept.name} className="py-5"><dt className="font-mono text-sm font-semibold text-sky-300">{concept.name}</dt><dd className="mt-2 text-sm leading-6 text-slate-400">{concept.description}</dd></div>)}
            </dl>
          </section>
          <div className="space-y-8">
            <TutorialList title="Kiedy używać" items={service.useCases} marker="✓" />
            <TutorialList title="Typowe błędy i ryzyka" items={service.commonMistakes} marker="!" />
          </div>
        </div>

        {service.sections && <div className="mb-12 space-y-8">
          {service.sections.map((section, index) => <section id={section.id ?? `${service.slug}-section-${index + 1}`} key={section.id ?? section.title} className="scroll-mt-24 rounded-2xl border border-white/10 bg-white/[0.025] p-6 sm:p-8">
            <h2 className="text-2xl font-semibold text-white">{section.title}</h2>
            <div className="mt-4 space-y-4 text-sm leading-7 text-slate-300">
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
            {section.items && <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              {section.items.map((item) => <div key={item.name} className="rounded-xl border border-white/10 bg-black/10 p-4"><dt className="font-mono text-sm font-semibold text-sky-300">{item.name}</dt><dd className="mt-2 text-sm leading-6 text-slate-400">{item.description}</dd></div>)}
            </dl>}
            {section.flow && <ol aria-label={`Przepływ: ${section.title}`} className="mt-6 flex flex-col gap-2">
              {section.flow.map((step, stepIndex) => <li key={step} className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/10 p-4 text-sm text-slate-300"><span className="grid size-7 shrink-0 place-items-center rounded-full bg-sky-400/10 font-mono text-xs font-semibold text-sky-300">{stepIndex + 1}</span><span>{step}</span></li>)}
            </ol>}
            {section.codeExample && <figure className="mt-6 min-w-0 overflow-hidden rounded-xl border border-white/10 bg-[#050b14]">
              {section.codeExample.caption && <figcaption className="border-b border-white/10 px-4 py-3 text-xs font-semibold text-slate-300">{section.codeExample.caption}</figcaption>}
              <pre className="max-w-full overflow-x-auto p-4 text-xs leading-6 text-sky-100" tabIndex={0}><code className={`language-${section.codeExample.language}`}>{section.codeExample.code}</code></pre>
            </figure>}
          </section>)}
        </div>}

        <section aria-labelledby="module-summary" className="mb-12 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] p-6 sm:p-8">
          <h2 id="module-summary" className="text-2xl font-semibold text-white">Najważniejsze informacje</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {service.summary.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-slate-300"><span aria-hidden="true" className="mt-0.5 font-semibold text-emerald-300">✓</span>{item}</li>)}
          </ul>
        </section>

        {quiz ? <ModuleQuizCallout moduleId={service.id} passingScore={quiz.passingScore} totalQuestions={quiz.questions.length} /> : <section className="rounded-2xl border border-sky-400/20 bg-gradient-to-r from-sky-400/10 to-indigo-400/5 p-6 sm:p-8">
          <p className="text-sm font-semibold text-sky-300">Co dalej?</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">{nextService ? `Kontynuuj naukę z ${nextService.name}` : "Podstawy ukończone"}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">{nextService ? nextService.shortDescription : "Wróć do ścieżki i utrwal poznane usługi. Kolejne formaty nauki pojawią się w następnych wersjach."}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href={nextService ? `/learn/${nextService.slug}` : "/#sciezka"} className="rounded-lg bg-sky-400 px-5 py-3 text-center text-sm font-semibold text-slate-950 transition hover:bg-sky-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400">{nextService ? `Przejdź do ${nextService.name}` : "Zakończ podstawy"}</Link>
            <Link href="/#uslugi" className="rounded-lg border border-white/15 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400">Wróć do wszystkich usług</Link>
          </div>
        </section>}
      </div>
    </main>
  );
}

function TutorialList({ title, items, marker }: { title: string; items: string[]; marker: string }) {
  return <section><h2 className="text-xl font-semibold text-white">{title}</h2><ul className="mt-5 space-y-3">{items.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-slate-400"><span className="grid mt-0.5 size-5 shrink-0 place-items-center rounded-full bg-sky-400/10 text-xs font-bold text-sky-300">{marker}</span>{item}</li>)}</ul></section>;
}
