"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { EvidenceCard } from "@/components/scenarios/evidence-card";
import { getCloudProvider } from "@/data/cloud-providers";
import { getLearningModule } from "@/data/learning-tracks";
import { saveScenarioAttempt } from "@/lib/scenario-progress";
import type { ScenarioDefinition } from "@/types/scenario";

type Stage = "briefing" | "evidence" | "diagnosis" | "result";

const stages: Array<{ id: Stage; label: string }> = [
  { id: "briefing", label: "Briefing" },
  { id: "evidence", label: "Dowody" },
  { id: "diagnosis", label: "Diagnoza" },
  { id: "result", label: "Wynik" },
];

const difficultyLabels = {
  beginner: "Początkujący",
  intermediate: "Średniozaawansowany",
  advanced: "Zaawansowany",
} as const;

export function ScenarioRunner({ scenario }: { scenario: ScenarioDefinition }) {
  const [stage, setStage] = useState<Stage>("briefing");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const stageHeadingRef = useRef<HTMLHeadingElement>(null);
  const questionLegendRef = useRef<HTMLLegendElement>(null);
  const provider = getCloudProvider(scenario.providerId as Parameters<typeof getCloudProvider>[0]);
  const primaryModule = getLearningModule(
    scenario.relatedModuleIds[0] as Parameters<typeof getLearningModule>[0],
  );
  const currentQuestion = scenario.questions[questionIndex];
  const score = scenario.questions.filter((question) => answers[question.id] === question.correctAnswerId).length;
  const passed = score >= scenario.passingScore;

  useEffect(() => {
    if (stage === "diagnosis") questionLegendRef.current?.focus();
    else stageHeadingRef.current?.focus();
  }, [stage, questionIndex]);

  function moveTo(nextStage: Stage) {
    setStage(nextStage);
  }

  function selectAnswer(answerId: string) {
    setAnswers((current) => ({ ...current, [currentQuestion.id]: answerId }));
  }

  function continueDiagnosis() {
    if (!answers[currentQuestion.id]) return;
    if (questionIndex < scenario.questions.length - 1) {
      setQuestionIndex((current) => current + 1);
      return;
    }
    saveScenarioAttempt(scenario.slug, score, scenario.questions.length, scenario.passingScore);
    moveTo("result");
  }

  function retry() {
    setAnswers({});
    setQuestionIndex(0);
    moveTo("briefing");
  }

  return (
    <main className="min-h-[75vh]">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-16">
        <nav aria-label="Okruszki" className="text-sm text-slate-500">
          <Link href="/scenarios" className="rounded text-slate-400 hover:text-sky-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400">Praktyczne scenariusze</Link>
          <span aria-hidden="true" className="mx-2">/</span><span>{scenario.title}</span>
        </nav>

        <ol aria-label="Postęp scenariusza" className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {stages.map((item, index) => {
            const activeIndex = stages.findIndex(({ id }) => id === stage);
            const isCurrent = item.id === stage;
            const isComplete = index < activeIndex;
            return (
              <li key={item.id} aria-current={isCurrent ? "step" : undefined} className={`rounded-xl border px-3 py-3 text-sm ${isCurrent ? "border-sky-400 bg-sky-400/10 text-sky-200" : isComplete ? "border-emerald-400/30 bg-emerald-400/[0.07] text-emerald-200" : "border-white/10 text-slate-500"}`}>
                <span className="mr-2 font-mono text-xs">{isComplete ? "✓" : index + 1}</span>{item.label}
              </li>
            );
          })}
        </ol>
        <p className="sr-only" aria-live="polite">Aktualny etap: {stages.find(({ id }) => id === stage)?.label}</p>

        {stage === "briefing" && (
          <section className="mt-8 rounded-2xl border border-sky-400/20 bg-gradient-to-br from-sky-400/[0.08] to-indigo-400/[0.04] p-6 sm:p-10">
            <p className="text-sm font-semibold text-sky-300">{provider?.shortName ?? scenario.providerId} · {difficultyLabels[scenario.difficulty]} · około {scenario.estimatedMinutes} min</p>
            <h1 ref={stageHeadingRef} tabIndex={-1} className="mt-3 max-w-4xl text-3xl font-semibold tracking-tight text-white outline-none sm:text-5xl">{scenario.briefing.incidentTitle}</h1>
            <div className="mt-8 grid gap-4 lg:grid-cols-2">
              <BriefingItem title="Sytuacja" content={scenario.briefing.situation} />
              <BriefingItem title="Oczekiwane zachowanie" content={scenario.briefing.expectedBehavior} />
              <BriefingItem title="Zaobserwowane zachowanie" content={scenario.briefing.observedBehavior} />
              <BriefingItem title="Twoje zadanie" content={scenario.briefing.task} />
            </div>
            <section aria-labelledby="scenario-objectives" className="mt-8 border-t border-white/10 pt-7">
              <h2 id="scenario-objectives" className="text-xl font-semibold text-white">Cele nauki</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {scenario.learningObjectives.map((objective) => <li key={objective} className="flex gap-3 text-sm leading-6 text-slate-300"><span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-sky-300" />{objective}</li>)}
              </ul>
            </section>
            <button type="button" onClick={() => moveTo("evidence")} className="mt-8 rounded-lg bg-sky-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400">Rozpocznij analizę</button>
          </section>
        )}

        {stage === "evidence" && (
          <section className="mt-8">
            <p className="text-sm font-semibold text-sky-300">Materiały diagnostyczne</p>
            <h1 ref={stageHeadingRef} tabIndex={-1} className="mt-2 text-3xl font-semibold text-white outline-none sm:text-4xl">Przeanalizuj dowody</h1>
            <p className="mt-4 max-w-3xl leading-7 text-slate-300">Porównaj tożsamość, operację i ARN zasobu z zakresem polityk. Wszystkie materiały pozostaną dostępne podczas diagnozy.</p>
            <div className="mt-8 grid min-w-0 gap-5 lg:grid-cols-2">
              {scenario.evidence.map((evidence) => <EvidenceCard key={evidence.id} evidence={evidence} />)}
            </div>
            <button type="button" onClick={() => moveTo("diagnosis")} className="mt-8 rounded-lg bg-sky-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400">Przejdź do diagnozy</button>
          </section>
        )}

        {stage === "diagnosis" && currentQuestion && (
          <div className="mt-8 grid min-w-0 gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(20rem,0.75fr)]">
            <section className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.025] p-6 sm:p-8">
              <p className="text-sm font-semibold text-sky-300">Pytanie {questionIndex + 1} z {scenario.questions.length}</p>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10" role="progressbar" aria-label={`Pytanie ${questionIndex + 1} z ${scenario.questions.length}`} aria-valuemin={1} aria-valuemax={scenario.questions.length} aria-valuenow={questionIndex + 1}>
                <div className="h-full rounded-full bg-sky-400" style={{ width: `${((questionIndex + 1) / scenario.questions.length) * 100}%` }} />
              </div>
              <fieldset className="mt-8">
                <legend ref={questionLegendRef} tabIndex={-1} className="text-xl font-semibold leading-8 text-white outline-none sm:text-2xl">{currentQuestion.prompt}</legend>
                {currentQuestion.evidenceIds && (
                  <p className="mt-3 text-xs leading-5 text-slate-400">
                    Powiązane dowody: {currentQuestion.evidenceIds.map((id, index) => {
                      const evidence = scenario.evidence.find((item) => item.id === id);
                      return <span key={id}>{index > 0 && ", "}<a href={`#diagnosis-evidence-${id}`} className="rounded text-sky-300 hover:text-sky-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400">{evidence?.title ?? id}</a></span>;
                    })}
                  </p>
                )}
                <div className="mt-7 grid gap-3">
                  {currentQuestion.answers.map((answer, index) => {
                    const selected = answers[currentQuestion.id] === answer.id;
                    return (
                      <label key={answer.id} className={`flex cursor-pointer items-start gap-4 rounded-xl border p-4 transition focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-sky-400 ${selected ? "border-sky-400 bg-sky-400/10" : "border-white/10 bg-black/10 hover:border-white/25"}`}>
                        <input type="radio" name={currentQuestion.id} value={answer.id} checked={selected} onChange={() => selectAnswer(answer.id)} className="sr-only" />
                        <span aria-hidden="true" className={`grid size-8 shrink-0 place-items-center rounded-lg border font-mono text-xs font-semibold ${selected ? "border-sky-400/50 text-sky-300" : "border-white/10 text-slate-500"}`}>{String.fromCharCode(65 + index)}</span>
                        <span className="pt-1 text-sm leading-6 text-slate-300">{answer.text}</span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
              <button type="button" disabled={!answers[currentQuestion.id]} onClick={continueDiagnosis} className="mt-7 rounded-lg bg-sky-400 px-5 py-3 text-sm font-semibold text-slate-950 transition enabled:hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400">
                {questionIndex === scenario.questions.length - 1 ? "Zakończ diagnozę" : "Następne pytanie"}
              </button>
              {!answers[currentQuestion.id] && <p className="mt-3 text-xs text-slate-500">Wybierz jedną odpowiedź, aby przejść dalej.</p>}
            </section>

            <aside aria-labelledby="diagnosis-evidence-title" className="min-w-0">
              <h2 id="diagnosis-evidence-title" className="text-lg font-semibold text-white">Dowody pod ręką</h2>
              <div className="mt-4 grid min-w-0 gap-4">
                {scenario.evidence.map((evidence) => <div id={`diagnosis-evidence-${evidence.id}`} key={evidence.id} className="min-w-0 scroll-mt-24"><EvidenceCard evidence={evidence} compact /></div>)}
              </div>
            </aside>
          </div>
        )}

        {stage === "result" && (
          <section className="mt-8" aria-live="polite">
            <div className="rounded-2xl border border-sky-400/20 bg-gradient-to-br from-sky-400/[0.08] to-indigo-400/[0.04] p-6 sm:p-10">
              <p className="text-sm font-semibold text-sky-300">Wynik scenariusza</p>
              <h1 ref={stageHeadingRef} tabIndex={-1} className="mt-3 text-3xl font-semibold text-white outline-none sm:text-5xl">{passed ? "Scenariusz ukończony" : "Wróć do dowodów i spróbuj ponownie"}</h1>
              <div className="mt-7 flex flex-wrap items-end gap-6 border-y border-white/10 py-6">
                <p className="font-mono text-6xl font-bold text-white">{score}<span className="text-2xl text-slate-500">/{scenario.questions.length}</span></p>
                <div><p className={`font-semibold ${passed ? "text-emerald-300" : "text-amber-300"}`}>{passed ? "Zaliczone" : "Niezaliczone"}</p><p className="mt-1 text-sm text-slate-400">Próg: {scenario.passingScore}/{scenario.questions.length}</p></div>
              </div>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <button type="button" onClick={retry} className="rounded-lg bg-sky-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400">Powtórz scenariusz</button>
                <Link href="/scenarios" className="rounded-lg border border-white/15 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400">Wróć do listy scenariuszy</Link>
                {primaryModule && <Link href={`/learn/${primaryModule.slug}`} className="rounded-lg border border-white/15 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400">Powtórz moduł {primaryModule.name} →</Link>}
              </div>
            </div>

            <section aria-labelledby="answer-review-title" className="mt-10">
              <h2 id="answer-review-title" className="text-2xl font-semibold text-white">Omówienie odpowiedzi</h2>
              <ol className="mt-6 grid gap-5">
                {scenario.questions.map((question, index) => {
                  const selected = question.answers.find(({ id }) => id === answers[question.id]);
                  const correct = question.answers.find(({ id }) => id === question.correctAnswerId);
                  const isCorrect = selected?.id === correct?.id;
                  return (
                    <li key={question.id} className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Pytanie {index + 1} · {isCorrect ? "Odpowiedź poprawna" : "Odpowiedź niepoprawna"}</p>
                      <h3 className="mt-2 text-lg font-semibold text-white">{question.prompt}</h3>
                      <dl className="mt-4 grid gap-3 text-sm">
                        <div><dt className="text-slate-500">Twoja odpowiedź</dt><dd className={isCorrect ? "mt-1 text-emerald-300" : "mt-1 text-rose-300"}>{selected?.text}</dd></div>
                        <div><dt className="text-slate-500">Poprawna odpowiedź</dt><dd className="mt-1 text-slate-200">{correct?.text}</dd></div>
                      </dl>
                      <p className="mt-4 border-t border-white/10 pt-4 text-sm leading-6 text-slate-300">{question.explanation}</p>
                    </li>
                  );
                })}
              </ol>
            </section>

            <section aria-labelledby="debrief-title" className="mt-10 rounded-2xl border border-white/10 bg-white/[0.025] p-6 sm:p-8">
              <p className="text-sm font-semibold text-sky-300">Szczegółowe omówienie incydentu</p>
              <h2 id="debrief-title" className="mt-2 text-3xl font-semibold text-white">Debrief techniczny</h2>
              <div className="mt-8 grid gap-8">
                <DebriefSection title="Root Cause"><p>{scenario.debrief.rootCause}</p></DebriefSection>
                <DebriefSection title="Correct Fix">
                  <p>{scenario.debrief.correctFix}</p>
                  {scenario.debrief.fixExamples && <div className="mt-5 grid min-w-0 gap-4 lg:grid-cols-2">{scenario.debrief.fixExamples.map((example) => <EvidenceCard key={example.id} evidence={example} compact />)}</div>}
                </DebriefSection>
                <DebriefSection title="Why It Works"><p>{scenario.debrief.whyItWorks}</p></DebriefSection>
                <DebriefSection title="Unsafe Fixes"><DebriefList items={scenario.debrief.unsafeFixes} marker="!" /></DebriefSection>
                <DebriefSection title="Prevention"><DebriefList items={scenario.debrief.prevention} marker="✓" /></DebriefSection>
              </div>
            </section>
          </section>
        )}
      </div>
    </main>
  );
}

function BriefingItem({ title, content }: { title: string; content: string }) {
  return <section className="rounded-xl border border-white/10 bg-black/10 p-5"><h2 className="font-semibold text-white">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-300">{content}</p></section>;
}

function DebriefSection({ title, children }: { title: string; children: React.ReactNode }) {
  return <section><h3 className="text-xl font-semibold text-white">{title}</h3><div className="mt-3 text-sm leading-7 text-slate-300">{children}</div></section>;
}

function DebriefList({ items, marker }: { items: readonly string[]; marker: string }) {
  return <ul className="grid gap-3 sm:grid-cols-2">{items.map((item) => <li key={item} className="flex gap-3 rounded-xl border border-white/10 bg-black/10 p-4"><span aria-hidden="true" className="font-semibold text-sky-300">{marker}</span><span>{item}</span></li>)}</ul>;
}
