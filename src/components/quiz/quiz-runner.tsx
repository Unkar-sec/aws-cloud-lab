"use client";

import { useState, useSyncExternalStore, type FormEvent } from "react";
import { getTrackProgress, saveCompletedAttempt } from "@/lib/learning-progress";
import { shuffleQuestionAnswers } from "@/lib/shuffle";
import { getLearningModule, getLearningTrack, getNextLearningModule } from "@/data/learning-tracks";
import type { QuizDefinition } from "@/types/quiz";
import { QuizQuestion } from "./quiz-question";
import { QuizResult } from "./quiz-result";

export function QuizRunner({ quiz }: { quiz: QuizDefinition }) {
  const learningModule = getLearningModule(quiz.moduleId);
  const learningTrack = getLearningTrack(quiz.trackId);
  const nextModule = getNextLearningModule(quiz.moduleId);
  const isClient = useSyncExternalStore(subscribeToClient, () => true, () => false);
  const [attemptQuestions, setAttemptQuestions] = useState(() => shuffleQuestionAnswers(quiz.questions));
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [completedTrackProgress, setCompletedTrackProgress] = useState<{ completed: number; total: number } | null>(null);
  const question = attemptQuestions[questionIndex];
  const isCorrect = selectedAnswerId === question.correctAnswerId;
  const correctAnswer = question.answers.find((answer) => answer.id === question.correctAnswerId);
  const progress = ((questionIndex + (isSubmitted ? 1 : 0)) / quiz.questions.length) * 100;

  function submitAnswer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedAnswerId) {
      setValidationMessage("Wybierz jedną odpowiedź przed zatwierdzeniem.");
      return;
    }
    setValidationMessage("");
    setIsSubmitted(true);
    if (isCorrect) setScore((currentScore) => currentScore + 1);
  }

  function continueQuiz() {
    if (questionIndex === quiz.questions.length - 1) {
      const savedProgress = saveCompletedAttempt(quiz.moduleSlug, score, quiz.questions.length, quiz.passingScore);
      setCompletedTrackProgress(getTrackProgress(quiz.trackId, savedProgress));
      setIsComplete(true);
      return;
    }
    setQuestionIndex((currentIndex) => currentIndex + 1);
    setSelectedAnswerId(null);
    setIsSubmitted(false);
    setValidationMessage("");
    setCompletedTrackProgress(null);
  }

  function retryQuiz() {
    setAttemptQuestions(shuffleQuestionAnswers(quiz.questions));
    setQuestionIndex(0);
    setSelectedAnswerId(null);
    setIsSubmitted(false);
    setScore(0);
    setIsComplete(false);
    setValidationMessage("");
  }

  if (!isClient) return <QuizLoadingState />;

  if (isComplete && learningModule && learningTrack) return <QuizResult moduleSlug={learningModule.slug} moduleName={learningModule.name} trackName={learningTrack.name} trackProgress={completedTrackProgress} nextModuleSlug={nextModule?.slug ?? null} nextModuleName={nextModule?.name ?? null} score={score} total={quiz.questions.length} passingScore={quiz.passingScore} onRetry={retryQuiz} />;

  return (
    <section aria-labelledby="quiz-progress-label" className="rounded-2xl border border-white/10 bg-[#0b1728]/90 p-5 sm:p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between gap-4 text-sm">
          <p id="quiz-progress-label" className="font-semibold text-white">Pytanie {questionIndex + 1} z {quiz.questions.length}</p>
          <p className="font-mono text-slate-500">{Math.round(progress)}%</p>
        </div>
        <div role="progressbar" aria-labelledby="quiz-progress-label" aria-valuemin={0} aria-valuemax={quiz.questions.length} aria-valuenow={questionIndex + (isSubmitted ? 1 : 0)} className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-gradient-to-r from-sky-400 to-indigo-400 transition-[width] duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <form onSubmit={submitAnswer} noValidate>
        <QuizQuestion question={question} selectedAnswerId={selectedAnswerId} isSubmitted={isSubmitted} onSelect={(answerId) => { setSelectedAnswerId(answerId); setValidationMessage(""); }} />
        <p aria-live="polite" className={`mt-5 min-h-6 text-sm font-medium ${validationMessage ? "text-amber-300" : "text-transparent"}`}>{validationMessage || "Brak błędu"}</p>
        {!isSubmitted && <button type="submit" className="mt-2 w-full rounded-lg bg-sky-400 px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-sky-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400 sm:w-auto">Zatwierdź odpowiedź</button>}
      </form>

      {isSubmitted && (
        <div aria-live="polite" className={`mt-6 rounded-xl border p-5 ${isCorrect ? "border-emerald-400/30 bg-emerald-400/[0.08]" : "border-rose-400/30 bg-rose-400/[0.08]"}`}>
          <p className={`font-semibold ${isCorrect ? "text-emerald-300" : "text-rose-300"}`}>{isCorrect ? "Odpowiedź poprawna" : "Odpowiedź błędna"}</p>
          <p className="mt-3 text-sm text-slate-300"><span className="font-semibold text-white">Poprawna odpowiedź:</span> {correctAnswer?.text}</p>
          <p className="mt-3 text-sm leading-6 text-slate-400">{question.explanation}</p>
          <button type="button" onClick={continueQuiz} className="mt-5 rounded-lg bg-sky-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400">{questionIndex === quiz.questions.length - 1 ? "Zobacz wynik" : "Następne pytanie"}</button>
        </div>
      )}
    </section>
  );
}

function subscribeToClient() {
  return () => undefined;
}

function QuizLoadingState() {
  return (
    <section aria-label="Przygotowywanie quizu" className="rounded-2xl border border-white/10 bg-[#0b1728]/90 p-5 sm:p-8">
      <div className="h-4 w-32 animate-pulse rounded bg-white/10" />
      <div className="mt-3 h-2 animate-pulse rounded-full bg-white/10" />
      <div className="mt-10 h-7 w-4/5 animate-pulse rounded bg-white/10" />
      <div className="mt-7 grid gap-3">
        {[0, 1, 2, 3].map((item) => <div key={item} className="h-16 animate-pulse rounded-xl border border-white/10 bg-white/[0.025]" />)}
      </div>
    </section>
  );
}
