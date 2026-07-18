import type { Metadata } from "next";
import Link from "next/link";
import { QuizRunner } from "@/components/quiz/quiz-runner";
import { iamQuiz } from "@/data/quizzes/iam-quiz";

export const metadata: Metadata = {
  title: "Quiz IAM",
  description: "Sprawdź wiedzę o IAM i ukończ pierwszy moduł ścieżki AWS Foundations.",
};

export default function IamQuizPage() {
  return (
    <main className="relative isolate min-h-[75vh] overflow-hidden">
      <div className="hero-glow absolute inset-0 -z-10" />
      <div className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-20">
        <nav aria-label="Okruszki" className="text-sm text-slate-500">
          <Link href="/learn/iam" className="rounded text-slate-400 hover:text-sky-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400">Tutorial IAM</Link>
          <span aria-hidden="true" className="mx-2">/</span><span>Quiz</span>
        </nav>
        <header className="py-10">
          <p className="text-sm font-semibold text-sky-300">AWS Foundations · IAM</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">{iamQuiz.title}</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">{iamQuiz.description} Quiz zawiera 5 pytań. Aby zaliczyć moduł, zdobądź co najmniej 4/5 punktów.</p>
        </header>
        <QuizRunner quiz={iamQuiz} />
      </div>
    </main>
  );
}
